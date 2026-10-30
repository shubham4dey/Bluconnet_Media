import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// One shared success page used by every visitor form.
const COPY = {
  contact: {
    title: "Successfully Submitted!",
    msg: "Thank you! We have received your message and will get back to you soon.",
  },
  subscribe: {
    title: "Successfully Subscribed!",
    msg: "Thank you! You are now subscribed to our latest updates and insights.",
  },
};

export default function FormSuccess() {
  const { isDarkMode } = useTheme();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const q = (params.get("type") || "").toLowerCase();
  const s = location.state && location.state.type;
  const type = s === "subscribe" || q === "subscribe" ? "subscribe" : "contact";
  const copy = COPY[type];
  const email =
    (location.state && location.state.email) || params.get("email") || "";
  const card = isDarkMode ? "bg-[#0f1535]/80" : "bg-white/80";
  const border = isDarkMode ? "border-white/10" : "border-gray-200";
  const muted = isDarkMode ? "text-gray-400" : "text-gray-600";
  const grad = isDarkMode
    ? "from-[#d4e157] to-[#06b6d4]"
    : "from-emerald-500 to-cyan-600";
  const btnT = isDarkMode ? "text-[#0a0e27]" : "text-white";
  return (
    <section
      className={`relative flex min-h-[80vh] items-center justify-center px-4 py-20 ${isDarkMode ? "bg-[#050508]" : "bg-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        role="status"
        aria-live="polite"
        className={`relative w-full max-w-md rounded-3xl border p-6 text-center shadow-2xl sm:p-8 ${card} ${border}`}
      >
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${grad} ${btnT}`}
          >
            <FaCheckCircle className="text-4xl" />
          </motion.div>
        </div>
        <h1
          className={`bg-gradient-to-r bg-clip-text text-2xl font-black uppercase text-transparent sm:text-3xl ${grad}`}
        >
          {copy.title}
        </h1>
        <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
          {copy.msg}
          {email ? (
            <>
              {" "}
              Sent to <span className="font-semibold">{email}</span>.
            </>
          ) : null}
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className={`mt-7 w-full rounded-xl bg-gradient-to-r px-6 py-3.5 text-sm font-bold uppercase ${grad} ${btnT}`}
        >
          Back to Home
        </motion.button>
        <Link
          to="/contact"
          className={`mt-3 inline-block text-xs font-semibold uppercase underline-offset-4 hover:underline ${muted}`}
        >
          Contact us again
        </Link>
      </motion.div>
    </section>
  );
}
