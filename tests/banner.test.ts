import { describe, expect, it } from "vitest";
import {
  renderBanner,
  printBanner,
  createBanner,
  THEMES,
} from "../src/index.js";

describe("renderBanner", () => {
  it("renders the startup dashboard", () => {
    const out = renderBanner({
      title: "My CLI",
      version: "2.1.0",
      environment: "Development",
      color: false,
      theme: "mono",
      show: ["version", "environment", "node", "memory"],
      fields: [
        { label: "Config", value: "Loaded" },
        { label: "Plugins", value: "14" },
      ],
    });

    expect(out).toContain("My CLI");
    expect(out).toContain("Version");
    expect(out).toContain("2.1.0");
    expect(out).toContain("Environment");
    expect(out).toContain("Development");
    expect(out).toContain("Node");
    expect(out).toContain("Memory");
    expect(out).toContain("Config");
    expect(out).toContain("Loaded");
    expect(out).toContain("Plugins");
    expect(out).toContain("14");
    expect(out).toContain("─");
    expect(out).toContain("🚀");
  });

  it("supports themes and optional icon", () => {
    const out = renderBanner({
      title: "Ship",
      icon: "✦",
      version: "1.0.0",
      color: true,
      theme: "ocean",
      show: ["version"],
    });
    expect(out).toContain("Ship");
    expect(out).toContain("✦");
    expect(out).toContain("\x1b[");
  });

  it("omits icon when false", () => {
    const out = renderBanner({
      title: "Plain",
      icon: false,
      color: false,
      show: ["node"],
    });
    expect(out).toContain("Plain");
    expect(out).not.toContain("🚀");
  });

  it("throws without title", () => {
    expect(() =>
      renderBanner({ title: "  ", color: false, show: ["node"] }),
    ).toThrow(/title/i);
  });

  it("printBanner writes output", () => {
    const lines: string[] = [];
    printBanner(
      {
        title: "Printer",
        version: "1.0.0",
        color: false,
        show: ["version"],
      },
      (s) => lines.push(s),
    );
    expect(lines.join("\n")).toContain("Printer");
  });

  it("createBanner binds defaults", () => {
    const banner = createBanner({
      title: "Bound",
      version: "3.0.0",
      color: false,
      theme: "minimal",
      show: ["version", "environment"],
    });
    expect(banner.render().toLowerCase()).toContain("bound");
    expect(banner.render({ version: "9.9.9" })).toContain("9.9.9");
  });

  it("exposes built-in themes", () => {
    expect(THEMES.default).toBeTruthy();
    expect(THEMES.ocean.name).toBe("ocean");
  });
});
