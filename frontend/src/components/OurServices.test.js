/**
 * ============================================================
 *  Tests — "Our Services" Home Page section (components/OurServices.jsx)
 *
 *  The section is a scroll-driven STACKED CARD experience:
 *  one tall (700vh) section, a single `position: sticky`
 *  viewport stage, and six cards absolutely centred in the
 *  SAME slot that rise 01 → 06 on top of each other. These
 *  tests lock down that architecture (sticky stage, shared
 *  centre slot, increasing z-index, no grid / no horizontal
 *  track), the content contract, and the day/night palette.
 *
 *  framer-motion's `whileInView` needs IntersectionObserver
 *  and `useScroll` observes element size — neither exists in
 *  jsdom, so both are stubbed below (the stubs never fire, so
 *  the animations simply stay on their initial frame; the
 *  assertions are about content, layering and styling).
 * ============================================================
 */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OurServices from "./OurServices";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

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

  return <OurServices />;
};

const renderSection = (dark = false) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        {dark ? <DarkModeSection /> : <OurServices />}
      </ThemeProvider>
    </MemoryRouter>,
  );

const getSection = (container) => container.querySelector("section");
const getCards = (container) => container.querySelectorAll("article");

afterEach(() => {
  document.body.innerHTML = "";
});

test("renders the red label, the heading with 'Deliver' and the description", () => {
  const { container } = renderSection();

  const label = screen.getByText("Our Services");
  expect(label).toBeInTheDocument();
  expect(label.textContent).toBe("Our Services");
  expect(label.className).toContain("uppercase");
  expect(label.className).toContain("text-red-600");

  const heading = screen.getByRole("heading", { level: 2 });
  expect(heading).toHaveTextContent(
    "Performance Marketing Solutions That Deliver",
  );
  expect(screen.getByText("Deliver").className).toContain("text-red-600");

  expect(
    screen.getByText(/Powerful performance marketing solutions built to/),
  ).toBeInTheDocument();

  expect(getSection(container)).toHaveAttribute("id", "our-services");
  expect(getSection(container).className).toContain("bg-white");
});

test("all six services render number, category label, title, description and icon", () => {
  const { container } = renderSection();

  const cards = getCards(container);
  expect(cards).toHaveLength(6);

  const expected = [
    ["01", "PARTNERS", "Affiliate Marketing", "Connect with the right partners"],
    ["02", "PERFORMANCE", "CPA & CPL Campaigns", "High-converting campaigns"],
    ["03", "AI POWERED", "Smartlink Technology", "AI-powered smartlinks"],
    ["04", "ANALYTICS", "Real-Time Tracking", "Advanced tracking platform"],
    ["05", "GLOBAL", "Global Reach", "Access to 150+ countries"],
    ["06", "24 / 7", "Dedicated Support", "24/7 expert support"],
  ];

  expected.forEach(([number, badge, title, description], index) => {
    const card = cards[index];
    expect(card).toHaveTextContent(number);
    expect(card).toHaveTextContent(badge);
    expect(card).toHaveTextContent(title);
    expect(card).toHaveTextContent(description);
    expect(card).toHaveTextContent("BluConnet");
    expect(card.querySelector("svg")).toBeInTheDocument();
    /* premium card shell */
    expect(card.className).toContain("rounded-");
    expect(card.className).toContain("overflow-hidden");
    expect(card.className).toContain("border");
  });
});

test("one tall section feeds a SINGLE sticky viewport stage", () => {
  const { container } = renderSection();

  /* the section supplies the scroll distance for all 6 cards */
  expect(getSection(container).style.height).toBe("700vh");

  /* exactly one sticky stage, locked to the top of the viewport */
  const stages = container.querySelectorAll(".sticky");
  expect(stages).toHaveLength(1);
  const stage = stages[0];
  expect(stage.className).toContain("top-0");
  expect(stage.className).toContain("h-screen");
  expect(stage.className).toContain("overflow-hidden");
  expect(stage).not.toHaveClass("overflow-x-auto");
});

test("all six cards share ONE central slot and stack by rising z-index", () => {
  const { container } = renderSection();

  const cards = getCards(container);
  expect(cards).toHaveLength(6);

  const slotClasses = new Set();

  cards.forEach((card, index) => {
    const layer = card.parentElement; /* the motion layer */
    const slot = layer.parentElement; /* the centred stage slot */

    /* every card is centred in an identical absolute slot →
       they all occupy the exact same central position */
    slotClasses.add(slot.className);
    expect(slot.className).toContain("absolute");
    expect(slot.className).toContain("inset-0");
    expect(slot.className).toContain("justify-center");

    /* incoming card always lands ON TOP of the previous ones */
    expect(layer.style.zIndex).toBe(String(index + 1));

    /* the layer is what scroll progress moves (y / scale /
       opacity) — there is no horizontal track to scroll */
    expect(layer.className).toContain("max-w-[94vw]");
  });

  expect(slotClasses.size).toBe(1);
});

test("night theme switches the section to the dark palette", () => {
  const { container } = renderSection(true);

  expect(getSection(container).className).toContain("bg-[#050508]");
  expect(screen.getByText("Our Services").className).toContain("text-red-500");
  expect(screen.getByRole("heading", { level: 2 }).className).toContain(
    "text-white",
  );
  expect(screen.getByText("Deliver").className).toContain("text-red-500");

  const cards = getCards(container);
  expect(cards).toHaveLength(6);
  cards.forEach((card) => {
    expect(card.className).toContain("bg-[#0a0f22]/90");
    expect(card.className).toContain("border-white/10");
  });
});

