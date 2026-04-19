import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";

vi.mock("@/components/LogoMascot", () => ({
  default: () => null,
}));

vi.mock("@/components/sections/HeroSection", () => ({
  default: () => <section id="hero" />,
}));

vi.mock("@/components/sections/InfoSection", () => ({
  default: () => <section id="info" />,
}));

vi.mock("@/components/sections/LineupSection", () => ({
  default: () => <section id="lineup" />,
}));

vi.mock("@/components/sections/TicketsSection", () => ({
  default: () => <section id="tickets" />,
}));

vi.mock("@/components/sections/CampingSection", () => ({
  default: () => <section id="camping" />,
}));

vi.mock("@/components/sections/GallerySection", () => ({
  default: () => <section id="gallery" />,
}));

beforeAll(() => {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];

    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("Index page banchetti call", () => {
  it("opens the dialog from the work-with-us section trigger", () => {
    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: /call banchetti/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/candida il tuo banchetto/i)).toBeInTheDocument();
  });
});
