import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BanchettiCallout from "@/components/BanchettiCallout";
import { LangProvider } from "@/components/LangToggle";

describe("BanchettiCallout", () => {
  it("opens and closes the call dialog from the section trigger", () => {
    render(
      <LangProvider>
        <BanchettiCallout />
      </LangProvider>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /call banchetti/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/candida il tuo banchetto/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /compila il form/i })).toHaveAttribute(
      "href",
      "https://docs.google.com/forms/d/e/1FAIpQLSc3Ic4b1XMTUmaOf3FPU8slh3JoT6SYVOHnddi7prnjVuiLcQ/viewform",
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
