/**
 * ============================================================
 *  Tests — reCAPTCHA v2 "I'm not a robot" checkbox opened from the badge
 *  (components/RecaptchaV2Checkbox.jsx)
 *
 *  Google's library is stubbed (`window.grecaptcha`), so the click →
 *  `grecaptcha.render()` path is exercised without any network access.
 *  The v3 integration (RecaptchaProtection.jsx) is not imported here:
 *  the two must stay independent, and nothing in this component may call
 *  `grecaptcha.execute()` or touch the v3 key.
 *
 *  DOM access is deliberate here: what is being tested is precisely how this
 *  component reaches INTO Google's badge (a third-party element that React does
 *  not render and that exposes no user-facing role/label to query), and
 *  `waitFor` + `getElementById` is how the imperatively-created panel is
 *  observed. Neither can be expressed with the user-facing queries those two
 *  lint rules expect, so they are disabled for this file only.
 * ============================================================
 */
/* eslint-disable testing-library/no-node-access, testing-library/prefer-find-by */
import React from "react";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import RecaptchaV2Checkbox, { v2SiteKey } from "./RecaptchaV2Checkbox";

const ENV_KEY = "REACT_APP_RECAPTCHA_V2_SITE_KEY";
const TEST_KEY = "6LtestV2CheckboxSiteKeyForJestTests000000";

/* Google's badge wrapper, exactly the element the component looks for. */
function mountBadge() {
  const badge = document.createElement("div");
  badge.className = "grecaptcha-badge";
  document.body.appendChild(badge);
  return badge;
}

function stubGrecaptcha() {
  const render = jest.fn(() => 0);
  const reset = jest.fn();
  window.grecaptcha = {
    render,
    reset,
    ready: (cb) => cb(),
  };
  return { render, reset };
}

beforeEach(() => {
  document.body.innerHTML = "";
  delete window.grecaptcha;
  process.env[ENV_KEY] = TEST_KEY;
});

afterEach(() => {
  cleanup();
  delete process.env[ENV_KEY];
  delete window.grecaptcha;
});

test("v2SiteKey() reads the configured v2 Checkbox site key", () => {
  expect(v2SiteKey()).toBe(TEST_KEY);
});

test("without a v2 key the badge is left completely untouched", () => {
  delete process.env[ENV_KEY];
  const badge = mountBadge();
  const { container } = render(<RecaptchaV2Checkbox />);

  expect(container.firstChild).toBeNull();
  expect(badge.children).toHaveLength(0);
  expect(document.getElementById("bc-recaptcha-v2-panel")).toBeNull();
});

test("a transparent click target is added on top of the whole badge box", () => {
  const badge = mountBadge();
  render(<RecaptchaV2Checkbox />);

  const trigger = badge.querySelector(".bc-recaptcha-v2-trigger");
  expect(trigger).not.toBeNull();
  /* it inherits the badge box (256x60 parked at right:-186px), so it covers the
     visible 70px while collapsed AND the point under the pointer after the
     hover slide-out — on every screen size and without racing the transition */
  expect(trigger.style.position).toBe("absolute");
  expect(trigger.style.top).toBe("0px");
  expect(trigger.style.right).toBe("0px");
  expect(trigger.style.bottom).toBe("0px");
  expect(trigger.style.left).toBe("0px");
  expect(trigger.style.width).toBe("");
  expect(trigger.style.height).toBe("");
  expect(trigger.style.pointerEvents).toBe("auto");
  expect(trigger.style.background).toBe("transparent");
  expect(trigger.getAttribute("aria-label")).toBe("Verify you are not a robot");
});

test("clicking the badge renders Google's v2 widget with the v2 site key", async () => {
  const badge = mountBadge();
  const readySpy = jest.fn((cb) => cb());
  const grecaptchaRender = jest.fn(() => 0);
  window.grecaptcha = { render: grecaptchaRender, reset: jest.fn(), ready: readySpy };
  render(<RecaptchaV2Checkbox />);

  fireEvent.click(badge.querySelector(".bc-recaptcha-v2-trigger"));

  const panel = await waitFor(() =>
    document.getElementById("bc-recaptcha-v2-panel")
  );
  expect(panel).not.toBeNull();
  /* nothing but a mount point for Google's own iframe */
  expect(panel.childElementCount).toBe(1);

  await waitFor(() => expect(readySpy).toHaveBeenCalled());
  await waitFor(() => expect(grecaptchaRender).toHaveBeenCalledTimes(1));
  const [mountPoint, options] = grecaptchaRender.mock.calls[0];
  expect(mountPoint).toBe(panel.firstElementChild);
  expect(options.sitekey).toBe(TEST_KEY);
  expect(typeof options.callback).toBe("function");
  expect(typeof options["expired-callback"]).toBe("function");

  /* the solved token is only handed to the optional listener — never decided,
     stored or faked here */
  expect(typeof options.callback("google-token")).toBe("undefined");
});

test("the widget draw is skipped when Google's library never becomes ready", async () => {
  const badge = mountBadge();
  const { render: grecaptchaRender } = stubGrecaptcha();
  window.grecaptcha.ready = () => {}; // never calls back
  render(<RecaptchaV2Checkbox />);

  fireEvent.click(badge.querySelector(".bc-recaptcha-v2-trigger"));
  await waitFor(
    () => expect(document.getElementById("bc-recaptcha-v2-panel")).not.toBeNull(),
    { timeout: 2000 }
  );

  expect(grecaptchaRender).not.toHaveBeenCalled();
}, 15000);

test("Escape closes the checkbox container", async () => {
  const badge = mountBadge();
  stubGrecaptcha();
  render(<RecaptchaV2Checkbox />);

  fireEvent.click(badge.querySelector(".bc-recaptcha-v2-trigger"));
  await waitFor(() =>
    expect(document.getElementById("bc-recaptcha-v2-panel")).not.toBeNull()
  );

  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() =>
    expect(document.getElementById("bc-recaptcha-v2-panel")).toBeNull()
  );
});

test("a click outside closes it, a click on the badge keeps it open", async () => {
  const badge = mountBadge();
  stubGrecaptcha();
  const outside = document.createElement("p");
  document.body.appendChild(outside);
  render(<RecaptchaV2Checkbox />);

  const trigger = badge.querySelector(".bc-recaptcha-v2-trigger");
  fireEvent.click(trigger);
  await waitFor(() =>
    expect(document.getElementById("bc-recaptcha-v2-panel")).not.toBeNull()
  );

  fireEvent.pointerDown(trigger);
  expect(document.getElementById("bc-recaptcha-v2-panel")).not.toBeNull();

  fireEvent.pointerDown(outside);
  await waitFor(() =>
    expect(document.getElementById("bc-recaptcha-v2-panel")).toBeNull()
  );
});

test("the click target is removed again on unmount", () => {
  const badge = mountBadge();
  const { unmount } = render(<RecaptchaV2Checkbox />);

  expect(badge.querySelector(".bc-recaptcha-v2-trigger")).not.toBeNull();
  unmount();
  expect(badge.querySelector(".bc-recaptcha-v2-trigger")).toBeNull();
});
