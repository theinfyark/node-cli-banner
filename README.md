# node-cli-banner

## Introduction

**node-cli-banner** draws a beautiful startup dashboard when your CLI boots.

```
──────────────────────────────────────
🚀 My CLI

Version      2.1.0
Environment  Development
Node         v22.16.0
Memory       82MB
CPU          2%
Config       Loaded
Plugins      14
──────────────────────────────────────
```

Works from **TypeScript and JavaScript** (ESM + CommonJS + `.d.ts`).

## Why this package exists

CLIs that print a clear status banner feel polished and debuggable — version, environment, and resource stats at a glance. **node-cli-banner** gives you that dashboard with themes and sensible defaults, without pulling in a large terminal UI framework.

## Installation

```bash
npm install node-cli-banner
```

Requires Node.js 18+.

## Features

- System info dashboard on CLI start
- Package / CLI version
- Environment label (`NODE_ENV` or custom)
- Git branch detection
- Node.js version
- Memory (RSS)
- CPU sample (%)
- Process uptime
- Theme support (`default`, `minimal`, `ocean`, `forest`, `sunset`, `mono`)
- Custom rows (Config, Plugins, …)
- Zero runtime dependencies
- Respects `NO_COLOR` / TTY

## Quick Start

### TypeScript

```ts
import { printBanner } from "node-cli-banner";

printBanner({
  title: "My CLI",
  version: "2.1.0",
  fields: [
    { label: "Config", value: "Loaded" },
    { label: "Plugins", value: "14" },
  ],
});
```

### JavaScript

```js
import { printBanner } from "node-cli-banner";

printBanner({
  title: "My CLI",
  version: "2.1.0",
  environment: "Development",
});
```

### CommonJS

```js
const { printBanner } = require("node-cli-banner");
printBanner({ title: "My CLI", version: "1.0.0" });
```

## API Reference

### `printBanner(options, write?)`

Renders and prints the banner. Returns the string.

### `renderBanner(options)`

Returns the banner string without printing.

### `createBanner(defaults)`

Returns `{ render, print }` bound to defaults.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | required | CLI name |
| `icon` | `string \| false` | `🚀` | Title prefix |
| `version` | `string` | — | Package version |
| `environment` | `string` | from `NODE_ENV` | Env label |
| `fields` | `{ label, value }[]` | `[]` | Extra rows |
| `show` | `BuiltinField[]` | version, environment, git, node, memory, cpu, uptime | Built-in rows |
| `theme` | theme name \| object | `default` | Colors |
| `width` | `number` | `38` | Border width |
| `color` | `boolean` | auto | Force colors |
| `cwd` | `string` | `process.cwd()` | Git detection root |

Built-in field ids: `version`, `environment`, `git`, `node`, `memory`, `cpu`, `uptime`, `platform`, `pid`, `cwd`.

### Themes

`THEMES` exports: `default`, `minimal`, `ocean`, `forest`, `sunset`, `mono`.

### System helpers

- `collectSystemInfo(options)`
- `detectGitBranch(cwd?)`
- `sampleCpuPercent(process?, sampleMs?)`

## Examples

```ts
printBanner({
  title: "Deploy Doctor",
  version: "1.2.0",
  theme: "forest",
  show: ["version", "environment", "git", "node", "memory"],
});
```

## Advanced Examples

### Bound banner for a CLI entrypoint

```ts
import { createBanner } from "node-cli-banner";
import pkg from "./package.json" with { type: "json" };

const banner = createBanner({
  title: "My CLI",
  version: pkg.version,
  theme: "ocean",
});

banner.print({
  fields: [{ label: "Mode", value: "interactive" }],
});
```

### Custom theme

```ts
printBanner({
  title: "Acme",
  version: "1.0.0",
  theme: {
    name: "acme",
    accent: "\x1b[35m",
    label: "\x1b[2m",
    value: "\x1b[37m",
    border: "\x1b[90m",
    title: "\x1b[1m\x1b[35m",
    muted: "\x1b[2m",
    reset: "\x1b[0m",
  },
});
```

### Capture string for tests / logs

```ts
import { renderBanner } from "node-cli-banner";

const text = renderBanner({
  title: "Test CLI",
  version: "0.0.1",
  color: false,
  show: ["version", "node"],
});
```

## Framework Integration

### commander / yargs / citty

Call `printBanner` once at the top of your `bin` entry before parsing commands:

```ts
#!/usr/bin/env node
import { printBanner } from "node-cli-banner";
import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };

printBanner({ title: pkg.name, version: pkg.version });

const program = new Command();
// ...
```

## TypeScript Usage

```ts
import {
  printBanner,
  type BannerOptions,
  type ThemeName,
} from "node-cli-banner";

const theme: ThemeName = "sunset";
const options: BannerOptions = { title: "CLI", theme, version: "1.0.0" };
printBanner(options);
```

## Error Handling

- Throws if `title` is missing/blank
- Git detection failures are silent (row omitted)
- CPU sampling is best-effort and sync (short ~20ms sample)

## Performance

- Designed for once-per-process startup
- Omit `cpu` from `show` to skip the short CPU sample
- Git call is capped with a short timeout

## Best Practices

- Pass `version` from your `package.json`
- Use `color: false` in CI when capturing output
- Keep custom `fields` short and high-signal
- Prefer `ocean` / `forest` themes for branded CLIs; `mono` for logs

## FAQ

**Does it require chalk / boxen?**  
No — zero runtime dependencies.

**Will it slow my CLI?**  
Negligibly. Skip `cpu` and/or `git` via `show` if you want absolute minimum overhead.

**How do I disable emoji?**  
Set `icon: false`.

**Can I use CommonJS?**  
Yes: `require("node-cli-banner")`.

## Migration Guide

### From hand-rolled `console.log` banners

Replace multi-line startup logs with one `printBanner({ ... })` call and add custom `fields` for app-specific status.

### SemVer

Breaking changes only in major versions — see `CHANGELOG.md`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No colors | TTY/`NO_COLOR`; set `color: true` to force |
| Missing Git Branch | Run inside a git repo or pass `cwd` |
| CPU always high/low | Treat as approximate; omit `cpu` if unused |
| Title too wide | Increase `width` |
| Types missing | Import from `node-cli-banner`; Node 18+ |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
