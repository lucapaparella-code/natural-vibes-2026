import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GallerySection from "@/components/sections/GallerySection";
import { LangProvider } from "@/components/LangToggle";
import { GALLERY_FILES } from "@/generated/galleryManifest";

describe("GallerySection", () => {
  it("loads more photos as the vertical gallery is scrolled", async () => {
    render(
      <LangProvider>
        <GallerySection />
      </LangProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /apri la gallery 2025/i }));

    expect(screen.getByText(`12 / ${GALLERY_FILES.length} foto caricate`)).toBeInTheDocument();

    const gallery = screen.getByRole("region", { name: /gallery verticale 2025/i });

    Object.defineProperty(gallery, "scrollHeight", {
      configurable: true,
      value: 2400,
    });
    Object.defineProperty(gallery, "clientHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(gallery, "scrollTop", {
      configurable: true,
      writable: true,
      value: 1300,
    });

    fireEvent.scroll(gallery);

    await waitFor(() => {
      expect(screen.getByText(`20 / ${GALLERY_FILES.length} foto caricate`)).toBeInTheDocument();
    });
  });
});
