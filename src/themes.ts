import type { Theme, ThemeName } from "./types.js";

const reset = "\x1b[0m";

export const THEMES: Record<ThemeName, Theme> = {
  default: {
    name: "default",
    accent: "\x1b[36m",
    label: "\x1b[2m",
    value: "\x1b[37m",
    border: "\x1b[90m",
    title: "\x1b[1m\x1b[36m",
    muted: "\x1b[2m",
    reset,
  },
  minimal: {
    name: "minimal",
    accent: "",
    label: "",
    value: "",
    border: "",
    title: "\x1b[1m",
    muted: "\x1b[2m",
    reset,
  },
  ocean: {
    name: "ocean",
    accent: "\x1b[38;5;39m",
    label: "\x1b[38;5;67m",
    value: "\x1b[38;5;159m",
    border: "\x1b[38;5;24m",
    title: "\x1b[1m\x1b[38;5;45m",
    muted: "\x1b[38;5;60m",
    reset,
  },
  forest: {
    name: "forest",
    accent: "\x1b[32m",
    label: "\x1b[2m\x1b[32m",
    value: "\x1b[37m",
    border: "\x1b[90m",
    title: "\x1b[1m\x1b[32m",
    muted: "\x1b[2m",
    reset,
  },
  sunset: {
    name: "sunset",
    accent: "\x1b[38;5;208m",
    label: "\x1b[38;5;180m",
    value: "\x1b[38;5;223m",
    border: "\x1b[38;5;130m",
    title: "\x1b[1m\x1b[38;5;214m",
    muted: "\x1b[38;5;95m",
    reset,
  },
  mono: {
    name: "mono",
    accent: "",
    label: "",
    value: "",
    border: "",
    title: "",
    muted: "",
    reset: "",
  },
};

export function resolveTheme(theme?: ThemeName | Theme): Theme {
  if (!theme) return THEMES.default;
  if (typeof theme === "string") {
    return THEMES[theme] ?? THEMES.default;
  }
  return {
    ...THEMES.default,
    ...theme,
    reset: theme.reset ?? reset,
  };
}

export function useColor(color?: boolean): boolean {
  if (color === true) return true;
  if (color === false) return false;
  if (process.env.NO_COLOR != null && process.env.NO_COLOR !== "") return false;
  if (process.env.FORCE_COLOR != null && process.env.FORCE_COLOR !== "0") {
    return true;
  }
  return Boolean(process.stdout.isTTY);
}

export function paint(enabled: boolean, theme: Theme): Theme {
  if (enabled) return theme;
  return {
    name: theme.name,
    accent: "",
    label: "",
    value: "",
    border: "",
    title: "",
    muted: "",
    reset: "",
  };
}
