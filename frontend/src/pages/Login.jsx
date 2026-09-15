import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "bluconnetnews" &&
      password === "bluconnetmedia@2026"
    ) {
      localStorage.setItem("bluconnet_admin_auth", "true");
      navigate("/admin-news");
    } else {
      setError("Invalid Username or Password!");
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDarkMode ? "bg-[#050508]" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${
          isDarkMode
            ? "bg-[#0f1535] border-white/10"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-black mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r ${
            isDarkMode
              ? "from-[#d4e157] to-[#06b6d4]"
              : "from-emerald-500 to-cyan-600"
          }`}
        >
          Admin Login
        </h2>

        <p
          className={`text-center mb-8 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Please sign in to access the News Panel
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Username
            </label>

            <div className="relative">
              <FaUser
                className={`absolute left-3 top-3.5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode
                    ? "bg-[#050508] border-white/10 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>

            <div className="relative">
              <FaLock
                className={`absolute left-3 top-3.5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode
                    ? "bg-[#050508] border-white/10 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash size={16} />
                ) : (
                  <FaEye size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center font-bold">
              {error}
            </p>
          )}

          {/* Sign In */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r ${
              isDarkMode
                ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                : "from-emerald-500 to-cyan-600"
            } hover:opacity-90 transition shadow-lg`}
          >
            Sign In
          </button>
        </form>

        {/* Back to Website */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;