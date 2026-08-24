import { execFileSync } from "node:child_process";
import os from "node:os";
import type { SystemSnapshot } from "./types.js";

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`;
  return `${Math.round(mb)}MB`;
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function environmentLabel(explicit?: string): string {
  if (explicit) return explicit;
  const env = process.env.NODE_ENV ?? "development";
  const map: Record<string, string> = {
    development: "Development",
    production: "Production",
    test: "Test",
    staging: "Staging",
  };
  return map[env] ?? env.charAt(0).toUpperCase() + env.slice(1);
}

/**
 * Average CPU usage % for this process since start (no busy-wait).
 * `_sampleMs` is kept for API compatibility and is unused.
 */
export function sampleCpuPercent(
  processRef: NodeJS.Process = process,
  _sampleMs = 20,
): number {
  const usage = processRef.cpuUsage();
  const elapsedUs = Math.max(1, processRef.uptime() * 1e6);
  const percent = ((usage.user + usage.system) / elapsedUs) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function detectGitBranch(cwd = process.cwd()): string | undefined {
  try {
    const out = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 500,
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

export function collectSystemInfo(options: {
  version?: string;
  environment?: string;
  cwd?: string;
  processRef?: NodeJS.Process;
  includeCpu?: boolean;
}): SystemSnapshot {
  const proc = options.processRef ?? process;
  const mem = proc.memoryUsage().rss;
  const cpu = options.includeCpu === false ? 0 : sampleCpuPercent(proc);

  return {
    version: options.version,
    environment: environmentLabel(options.environment),
    gitBranch: detectGitBranch(options.cwd ?? proc.cwd()),
    node: proc.version,
    memory: formatBytes(mem),
    cpu: `${cpu}%`,
    uptime: formatUptime(proc.uptime()),
    platform: `${os.type()} ${os.arch()}`,
    pid: String(proc.pid),
    cwd: options.cwd ?? proc.cwd(),
  };
}

export { formatBytes, formatUptime, environmentLabel };
