export type ThemeName = "default" | "minimal" | "ocean" | "forest" | "sunset" | "mono";

export interface Theme {
  name: ThemeName | string;
  accent: string;
  label: string;
  value: string;
  border: string;
  title: string;
  muted: string;
  reset: string;
}

export type BuiltinField =
  | "version"
  | "environment"
  | "git"
  | "node"
  | "memory"
  | "cpu"
  | "uptime"
  | "platform"
  | "pid"
  | "cwd";

export interface BannerField {
  label: string;
  value: string;
}

export interface BannerOptions {
  /** CLI / product title shown under the top border */
  title: string;
  /** Optional emoji or icon prefix. Default: 🚀 */
  icon?: string | false;
  /** Package / CLI version */
  version?: string;
  /** Environment label (Development, Production, …). Auto from NODE_ENV if omitted */
  environment?: string;
  /** Extra custom rows (e.g. Config, Plugins) */
  fields?: BannerField[];
  /** Which built-in rows to show. Default: version, environment, git, node, memory, cpu, uptime */
  show?: BuiltinField[];
  /** Theme name or custom Theme object */
  theme?: ThemeName | Theme;
  /** Border width in characters. Default: 38 */
  width?: number;
  /** Force/disable ANSI colors. Default: auto (TTY && !NO_COLOR) */
  color?: boolean;
  /** Working directory for git branch detection */
  cwd?: string;
  /** Process to sample for memory/cpu. Default: process */
  processRef?: NodeJS.Process;
}

export interface SystemSnapshot {
  version?: string;
  environment: string;
  gitBranch?: string;
  node: string;
  memory: string;
  cpu: string;
  uptime: string;
  platform: string;
  pid: string;
  cwd: string;
}
