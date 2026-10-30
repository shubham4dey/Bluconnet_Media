/**
 * ============================================================
 *  Tests — "Top Offers" Home Page section (components/TopOffers.jsx)
 *
 *  Covers the premium cover-flow redesign contract: the header
 *  (red label, red-highlight heading, description, View All
 *  Offers links), all 12 offers with their final Cloudinary
 *  backgrounds and padded 01–12 numbering, the infinite-loop
 *  carousel (centre 01 → prev = 12, wraps both ways, arrows
 *  never disabled), the exactly-12 clickable pagination pills
 *  and the light/dark (day/night) theming.
 *
 *  framer-motion's `whileInView` needs IntersectionObserver and
 *  framer's layout tracking may need ResizeObserver — neither
 *  exists in jsdom, so both are stubbed below (the stubs never
 *  fire, so the entrance animations simply stay on their initial
 *  frame; the assertions are about content, `data-active` state
 *  and wiring — never animated pixels).
 * ============================================================
 */
/* Counting the offer cards, reading their padded numbers and
   reaching the active centre card have no ARIA role of their
   own, so the structural queries below are the reliable way to
   assert them — same approach as RecaptchaV2Checkbox.test.js. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React, { useEffect } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopOffers from "./TopOffers";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

/* `virtual: true` because CRA 5's jest resolver reads `main`
   (react-router-dom v7 ships an `exports` map instead) — the
   section only needs `Link`/`MemoryRouter`, so the mock is what
   it sees: a plain anchor carrying the `to` as its href. */
jest.mock(
  "react-router-dom",
  () => {
    const react = require("react");

    return {
      Link: ({ to, children, ...rest }) =>
        react.createElement("a", { href: to, ...rest }, children),
      MemoryRouter: ({ children }) => children,
    };
  },
  { virtual: true },
);

beforeAll(() => {
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserverStub {
      constructor(callback) {
        this.callback = callback;
      }
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

/* The section reads `isDarkMode` from ThemeContext, so the night
   theme is reached by flipping the real toggle on mount. */
const DarkModeSection = () => {
  const { toggleTheme } = useTheme();

  useEffect(() => {
    toggleTheme();
  }, [toggleTheme]);

  return <TopOffers />;
};

const renderSection = (dark = false) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        {dark ? <DarkModeSection /> : <TopOffers />}
      </ThemeProvider>
    </MemoryRouter>,
  );

const getSection = (container) => container.querySelector("section");

/* The active (large centre) card and its padded number — exactly
   one card carries data-active="true" at any moment. */
const getActiveCard = (container) =>
  container.querySelector('[data-active="true"]');
const getActiveNumber = (container) =>
  getActiveCard(container).querySelector("[data-offer-number]").textContent;

/* The 12 final Cloudinary backgrounds, in offer order 01 → 12. */
const expectedImages = [
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374518/a1_swuodx.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374525/a2_resycz.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374542/a3_coc4kr.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374535/a4_drvnjt.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374548/a5_s68jm0.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374555/a6_jdaca8.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374561/a7_m9rmep.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374581/a8_j7uhwu.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374587/a9_a0s6il.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374594/a10_eqrmgr.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374614/a11_duxmzw.png",
  "https://res.cloudinary.com/wyixfdon/image/upload/v1791374621/a12_yidimi.png",
];

afterEach(() => {
  document.body.innerHTML = "";
});

test("renders the header, description and View All Offers buttons", () => {
  const { container } = renderSection();

  /* small uppercase red label */
  const label = screen.getByText("Top Offers");
  expect(label).toBeInTheDocument();
  expect(label.className).toContain("uppercase");
  expect(label.className).toContain("text-red-600");

  /* main heading — "High-Converting" is the red part */
  const heading = screen.getByRole("heading", { level: 2 });
  expect(heading).toHaveTextContent("Explore High-Converting Offers");
  expect(screen.getByText("High-Converting").className).toContain(
    "text-red-600",
  );

  /* supporting description from the reference design */
  expect(
    screen.getByText(/Discover our top performing offers/),
  ).toBeInTheDocument();

  /* View All Offers button: top-right on desktop + stacked on mobile */
  const links = screen.getAllByRole("link", { name: /View All Offers/i });
  expect(links).toHaveLength(2);
  links.forEach((link) =>
    expect(link).toHaveAttribute("href", "/services/affiliate"),
  );

  /* section identity + light (day) background + white glass arrows */
  const section = getSection(container);
  expect(section).toHaveAttribute("id", "top-offers");
  expect(section.className).toContain("bg-white");
  expect(
    screen.getByRole("button", { name: "Previous offers" }).className,
  ).toContain("bg-white");
});

test("renders all 12 offers with padded numbers, Cloudinary backgrounds and content", () => {
  const { container } = renderSection();

  const cards = container.querySelectorAll("article");
  expect(cards).toHaveLength(12);

  /* exactly the 12 provided images, in offer order, full-bleed
     on the complete card background via object-cover */
  const images = container.querySelectorAll("article img");
  expect(images).toHaveLength(12);
  images.forEach((img, i) => {
    expect(img.getAttribute("src")).toBe(expectedImages[i]);
    expect(img.className).toContain("object-cover");
  });

  /* visual numbering 01 → 12 (never 0-based) */
  const numbers = Array.from(cards, (card) =>
    card.querySelector("[data-offer-number]").textContent,
  );
  expect(numbers).toEqual([
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ]);

  /* centre card mirrors the reference screenshot */
  const [first] = cards;
  expect(first).toHaveTextContent("Amazon US - CPL");
  expect(first).toHaveTextContent("E-commerce");
  expect(first).toHaveTextContent("$45.00");
  expect(first).toHaveTextContent("US");
  expect(first.querySelector("svg")).toBeInTheDocument();

  /* the percentage payout renders too */
  expect(container.textContent).toContain("Casino - RevShare");
  expect(container.textContent).toContain("35%");

  /* every card keeps the large rounded background treatment */
  cards.forEach((card) => {
    expect(card.className).toContain("rounded-[30px]");
    expect(card.querySelector("svg")).toBeInTheDocument();
  });
});

test("infinite loop wraps both ways and the arrows are never disabled", () => {
  const { container } = renderSection();

  const prev = screen.getByRole("button", { name: "Previous offers" });
  const next = screen.getByRole("button", { name: "Next offers" });

  /* initial state — centre = 01 */
  expect(getActiveNumber(container)).toBe("01");
  expect(prev).not.toBeDisabled();
  expect(next).not.toBeDisabled();

  /* PREVIOUS — centre becomes 12 (the left neighbour), then back */
  fireEvent.click(prev);
  expect(getActiveNumber(container)).toBe("12");
  fireEvent.click(next);
  expect(getActiveNumber(container)).toBe("01");

  /* NEXT walks 01 → 02 → … → 12 → 01 and keeps going forever */
  const walked = [];
  for (let i = 0; i < 12; i += 1) {
    fireEvent.click(next);
    walked.push(getActiveNumber(container));
    expect(next).not.toBeDisabled();
    expect(prev).not.toBeDisabled();
  }
  expect(walked).toEqual([
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "01",
  ]);
});

test("pagination shows exactly 12 pills and each pill activates its offer", () => {
  const { container } = renderSection();

  const pills = screen.getAllByRole("button", { name: /^Show offer / });
  expect(pills).toHaveLength(12);

  /* the active pill is the wider, darker one */
  const activePill = container.querySelector('[aria-current="true"]');
  expect(activePill).toBe(pills[0]);
  expect(activePill.className).toContain("w-9");

  /* clicking pill 07 activates offer 07 … */
  fireEvent.click(pills[6]);
  expect(getActiveNumber(container)).toBe("07");
  expect(container.querySelector('[aria-current="true"]')).toBe(pills[6]);

  /* … and pill 12 activates offer 12 */
  fireEvent.click(pills[11]);
  expect(getActiveNumber(container)).toBe("12");
  expect(container.querySelector('[aria-current="true"]')).toBe(pills[11]);
});

test("night theme switches the shell, label, arrows and pills to the dark palette", () => {
  const { container } = renderSection(true);

  const section = getSection(container);
  expect(section.className).toContain("bg-[#050508]");
  expect(screen.getByText("Top Offers").className).toContain("text-red-500");
  expect(screen.getByRole("heading", { level: 2 }).className).toContain(
    "text-white",
  );
  expect(screen.getByText("High-Converting").className).toContain(
    "text-red-500",
  );

  /* dark translucent arrow buttons + white active pill */
  expect(
    screen.getByRole("button", { name: "Previous offers" }).className,
  ).toContain("bg-white/10");
  const activePill = container.querySelector('[aria-current="true"]');
  expect(activePill.className).toContain("bg-white");
});

/* =========================================================
   AUTOPLAY — automatic movement only: 4s cadence reusing the
   existing next() transition, hover pause/resume, and timer
   resets on arrows / pills / touch. Fake timers drive the
   interval; assertions read `data-active` numbers only.
========================================================= */
describe("autoplay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /* The carousel wrapper is the only element with `mt-10` inside
     the section — it carries the hover/touch input handlers. */
  const getCarousel = (container) =>
    getSection(container).querySelector(".mt-10");

  const advance = (ms) => {
    act(() => {
      jest.advanceTimersByTime(ms);
    });
  };

  test("moves to the next offer every 4 seconds and loops 12 → 01", () => {
    const { container } = renderSection();

    expect(getActiveNumber(container)).toBe("01");

    /* nothing moves before the full 4 seconds elapse */
    advance(3999);
    expect(getActiveNumber(container)).toBe("01");

    /* exactly at 4s: 01 → 02, then exactly one slide per 4s —
       a duplicate/accelerated timer would skip slides here */
    advance(1);
    expect(getActiveNumber(container)).toBe("02");
    advance(4000);
    expect(getActiveNumber(container)).toBe("03");

    /* walk the rest of the deck: 03 → 12 is 9 more ticks */
    for (let i = 0; i < 9; i += 1) advance(4000);
    expect(getActiveNumber(container)).toBe("12");

    /* infinite loop wraps 12 → 01 */
    advance(4000);
    expect(getActiveNumber(container)).toBe("01");
  });

  test("next / previous / pagination clicks restart the 4s countdown", () => {
    const { container } = renderSection();
    const next = screen.getByRole("button", { name: "Next offers" });
    const prev = screen.getByRole("button", { name: "Previous offers" });
    const pills = screen.getAllByRole("button", { name: /^Show offer / });

    /* consume 3.5s so the original interval would fire at t=4.0s */
    advance(3500);

    /* NEXT resets: at t=4.0s nothing fires (the pre-click timer
       would have fired exactly there), the fresh 4s fires at 7.5s */
    fireEvent.click(next);
    expect(getActiveNumber(container)).toBe("02");
    advance(500);
    expect(getActiveNumber(container)).toBe("02");
    advance(3500);
    expect(getActiveNumber(container)).toBe("03");

    /* PREVIOUS resets too (and keeps working normally) */
    fireEvent.click(prev);
    expect(getActiveNumber(container)).toBe("02");
    advance(4000);
    expect(getActiveNumber(container)).toBe("03");

    /* pagination pills reset as well */
    fireEvent.click(pills[5]);
    expect(getActiveNumber(container)).toBe("06");
    advance(3999);
    expect(getActiveNumber(container)).toBe("06");
    advance(1);
    expect(getActiveNumber(container)).toBe("07");
  });

  test("hovering pauses autoplay and leaving resumes the current slide", () => {
    const { container } = renderSection();
    const carousel = getCarousel(container);

    /* hover → paused: two would-be ticks pass with no movement */
    fireEvent.mouseOver(carousel);
    advance(8000);
    expect(getActiveNumber(container)).toBe("01");

    /* manual navigation keeps working while paused */
    fireEvent.click(screen.getByRole("button", { name: "Next offers" }));
    expect(getActiveNumber(container)).toBe("02");
    advance(8000);
    expect(getActiveNumber(container)).toBe("02");

    /* leave → resumed from the current slide, full 4s counted */
    fireEvent.mouseOut(carousel, { relatedTarget: document.body });
    advance(3999);
    expect(getActiveNumber(container)).toBe("02");
    advance(1);
    expect(getActiveNumber(container)).toBe("03");
  });

  test("touching the carousel restarts the countdown without moving the slide", () => {
    const { container } = renderSection();
    const carousel = getCarousel(container);

    advance(3000);

    /* a tap resets the timer but never navigates by itself */
    fireEvent.touchStart(carousel);
    expect(getActiveNumber(container)).toBe("01");

    /* the pre-touch interval would have fired at t=4.0s — cleared */
    advance(1000);
    expect(getActiveNumber(container)).toBe("01");

    /* fresh full 4s counted from the touch */
    advance(2999);
    expect(getActiveNumber(container)).toBe("01");
    advance(1);
    expect(getActiveNumber(container)).toBe("02");
  });
});