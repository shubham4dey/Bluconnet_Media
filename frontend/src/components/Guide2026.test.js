/**
 * ============================================================
 *  Tests - Homepage "OUR NEWS" section newsletter subscription
 *  (components/Guide2026.jsx -> POST /api/subscribe).
 *
 *  Locks down the complete subscription flow:
 *    - email validation happens BEFORE any request (no fake success),
 *    - a valid signup POSTs the real endpoint with the reCAPTCHA token,
 *      then lands on the shared /form-success page,
 *    - HTTP 409 -> "already subscribed", 5xx/network -> generic error,
 *      all rendered in the existing hint slot (layout unchanged),
 *    - a double submit fires exactly ONE request.
 *
 *  framer-motion's `whileInView` needs IntersectionObserver, which does
 *  not exist in jsdom - it is stubbed below (the stub never fires, so the
 *  animations simply stay on their initial frame).
 * ============================================================
 */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Guide2026 from "./Guide2026";
import FormSuccess from "../pages/FormSuccess";
import { ThemeProvider } from "../context/ThemeContext";
import { getRecaptchaToken } from "./RecaptchaProtection";
import API_BASE from "../services/apiConfig";

/* The section fetches published news on mount - return an empty list so the
   newsletter block (which is independent of the news cards) renders. */
jest.mock("../services/newsApi", () => ({
  getPublishedNews: jest.fn(async () => ({ ok: false, data: [] })),
  resolveUrl: (url) => url,
}));

jest.mock("./RecaptchaProtection", () => ({
  getRecaptchaToken: jest.fn(async () => "test-token"),
}));

beforeAll(() => {
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const SUBSCRIBE_ENDPOINT = `${API_BASE}/subscribe`;
const INVALID_EMAIL_MESSAGE = "Please enter a valid email address.";
const DUPLICATE_MESSAGE = "This email is already subscribed.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

beforeEach(() => {
  global.fetch = jest.fn();
  // CRA runs jest with `resetMocks: true`, which wipes the factory
  // implementation before every test - re-arm it here.
  getRecaptchaToken.mockImplementation(async () => "test-token");
});

const renderSection = async () => {
  const view = render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Guide2026 />} />
          <Route path="/form-success" element={<FormSuccess />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

  // flush the news fetch started in useEffect so its state updates
  // land inside act()
  await act(async () => {
    await Promise.resolve();
  });

  return view;
};

const getEmailInput = () =>
  screen.getByPlaceholderText("Enter your email address");

const getForm = () => getEmailInput().closest("form");

const submitForm = (value) => {
  if (value !== undefined) {
    fireEvent.change(getEmailInput(), { target: { value } });
  }
  fireEvent.submit(getForm());
};

test("shows the default hint and refuses an invalid email without any request", async () => {
  await renderSection();

  expect(screen.getByText(/No spam/)).toBeInTheDocument();

  submitForm("definitely-not-an-email");

  const alert = screen.getByRole("alert");
  expect(alert).toHaveTextContent(INVALID_EMAIL_MESSAGE);

  expect(global.fetch).not.toHaveBeenCalled();
  expect(getRecaptchaToken).not.toHaveBeenCalled();
  // still on the homepage - no fake success navigation
  expect(getEmailInput()).toBeInTheDocument();
});

test("refuses an empty email the same way", async () => {
  await renderSection();

  submitForm("");

  expect(screen.getByRole("alert")).toHaveTextContent(INVALID_EMAIL_MESSAGE);
  expect(global.fetch).not.toHaveBeenCalled();
});

test("a valid signup POSTs /api/subscribe and lands on the success page", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({ success: true, message: "subscribed" }),
  });

  await renderSection();
  submitForm("reader@example.com");

  // shared dedicated success page, reached only AFTER the API confirmed 201
  expect(await screen.findByText("Successfully Subscribed!")).toBeInTheDocument();
  expect(screen.getByText(/reader@example\.com/)).toBeInTheDocument();

  expect(getRecaptchaToken).toHaveBeenCalledWith("subscribe");
  expect(global.fetch).toHaveBeenCalledTimes(1);

  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe(SUBSCRIBE_ENDPOINT);
  expect(options.method).toBe("POST");
  expect(options.headers["Content-Type"]).toBe("application/json");
  expect(JSON.parse(options.body)).toEqual({
    email: "reader@example.com",
    agreeToSubscribe: true,
    recaptchaToken: "test-token",
  });
});
test("HTTP 409 shows the already-subscribed message and stays on the homepage", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 409,
    json: async () => ({ success: false, message: DUPLICATE_MESSAGE }),
  });

  await renderSection();
  submitForm("reader@example.com");

  expect(await screen.findByRole("alert")).toHaveTextContent(DUPLICATE_MESSAGE);

  // no fake success navigation: the form is still there with the value kept
  expect(getEmailInput().value).toBe("reader@example.com");

  // typing clears the feedback again (same slot falls back to the hint)
  fireEvent.change(getEmailInput(), { target: { value: "other@example.com" } });
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByText(/No spam/)).toBeInTheDocument();
});

test("HTTP 500 shows the generic error message", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ success: false, message: "Something went wrong." }),
  });

  await renderSection();
  submitForm("reader@example.com");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    GENERIC_ERROR_MESSAGE
  );
  expect(getEmailInput()).toBeInTheDocument();
});

test("a network failure shows the generic error message", async () => {
  global.fetch.mockRejectedValue(new Error("offline"));

  await renderSection();
  submitForm("reader@example.com");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    GENERIC_ERROR_MESSAGE
  );
  expect(getEmailInput()).toBeInTheDocument();
});

test("a double submit fires exactly ONE request", async () => {
  // never resolves - the form must stay locked in its pending state
  global.fetch = jest.fn(() => new Promise(() => {}));

  await renderSection();
  submitForm("reader@example.com");
  submitForm("reader@example.com");

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(getForm().querySelector("button[type=submit]").disabled).toBe(true);
});

