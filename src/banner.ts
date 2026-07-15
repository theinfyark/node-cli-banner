import { collectSystemInfo } from "./system.js";
import { paint, resolveTheme, useColor } from "./themes.js";
import type {
  BannerField,
  BannerOptions,
  BuiltinField,
  SystemSnapshot,
} from "./types.js";

const DEFAULT_SHOW: BuiltinField[] = [
  "version",
  "environment",
  "git",
  "node",
  "memory",
  "cpu",
  "uptime",
];

const LABELS: Record<BuiltinField, string> = {
  version: "Version",
  environment: "Environment",
  git: "Git Branch",
  node: "Node",
  memory: "Memory",
  cpu: "CPU",
  uptime: "Uptime",
  platform: "Platform",
  pid: "PID",
  cwd: "CWD",
};

function visibleWidth(text: string): number {
  // Strip ANSI for width calc
  return text.replace(/\x1b\[[0-9;]*m/g, "").length;
}

function padLabel(label: string, width: number): string {
  return label.padEnd(width, " ");
}

function borderLine(width: number, theme: ReturnType<typeof paint>): string {
  const line = "─".repeat(Math.max(8, width));
  return `${theme.border}${line}${theme.reset}`;
}

function builtinRows(
  snapshot: SystemSnapshot,
  show: BuiltinField[],
): BannerField[] {
  const rows: BannerField[] = [];
  for (const key of show) {
    let value: string | undefined;
    switch (key) {
      case "version":
        value = snapshot.version;
        break;
      case "environment":
        value = snapshot.environment;
        break;
      case "git":
        value = snapshot.gitBranch;
        break;
      case "node":
        value = snapshot.node;
        break;
      case "memory":
        value = snapshot.memory;
        break;
      case "cpu":
        value = snapshot.cpu;
        break;
      case "uptime":
        value = snapshot.uptime;
        break;
      case "platform":
        value = snapshot.platform;
        break;
      case "pid":
        value = snapshot.pid;
        break;
      case "cwd":
        value = snapshot.cwd;
        break;
    }
    if (value == null || value === "") continue;
    rows.push({ label: LABELS[key], value });
  }
  return rows;
}

/**
 * Render the startup dashboard as a string (does not print).
 */
export function renderBanner(options: BannerOptions): string {
  if (!options.title?.trim()) {
    throw new Error("title is required");
  }

  const width = options.width ?? 38;
  const color = useColor(options.color);
  const theme = paint(color, resolveTheme(options.theme));
  const show = options.show ?? DEFAULT_SHOW;
  const includeCpu = show.includes("cpu");

  const snapshot = collectSystemInfo({
    version: options.version,
    environment: options.environment,
    cwd: options.cwd,
    processRef: options.processRef,
    includeCpu,
  });

  const rows = [
    ...builtinRows(snapshot, show),
    ...(options.fields ?? []),
  ];

  const labelWidth = Math.max(12, ...rows.map((r) => r.label.length));
  const icon =
    options.icon === false ? "" : options.icon == null ? "🚀 " : `${options.icon} `;

  const lines: string[] = [];
  lines.push(borderLine(width, theme));
  lines.push(`${theme.title}${icon}${options.title}${theme.reset}`);
  lines.push("");

  for (const row of rows) {
    const label = `${theme.label}${padLabel(row.label, labelWidth)}${theme.reset}`;
    const value = `${theme.value}${row.value}${theme.reset}`;
    lines.push(`${label}  ${value}`);
  }

  lines.push(borderLine(width, theme));
  return lines.join("\n");
}

/**
 * Print the startup dashboard to stdout (or a custom write function).
 */
export function printBanner(
  options: BannerOptions,
  write: (line: string) => void = (s) => {
    process.stdout.write(`${s}\n`);
  },
): string {
  const banner = renderBanner(options);
  write(banner);
  return banner;
}

/**
 * Create a reusable banner printer bound to defaults.
 */
export function createBanner(defaults: Omit<BannerOptions, "title"> & { title?: string }) {
  return {
    render(overrides: Partial<BannerOptions> & { title?: string } = {}) {
      const title = overrides.title ?? defaults.title;
      if (!title) throw new Error("title is required");
      return renderBanner({ ...defaults, ...overrides, title });
    },
    print(overrides: Partial<BannerOptions> & { title?: string } = {}) {
      const title = overrides.title ?? defaults.title;
      if (!title) throw new Error("title is required");
      return printBanner({ ...defaults, ...overrides, title });
    },
  };
}

export { visibleWidth };
