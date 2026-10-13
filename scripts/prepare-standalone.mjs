import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");
const staticDir = join(root, ".next", "static");
const publicDir = join(root, "public");

if (!existsSync(standalone)) {
  console.warn("[prepare-standalone] .next/standalone not found, skip.");
  process.exit(0);
}

mkdirSync(join(standalone, ".next"), { recursive: true });

if (existsSync(staticDir)) {
  cpSync(staticDir, join(standalone, ".next", "static"), { recursive: true });
}

if (existsSync(publicDir)) {
  cpSync(publicDir, join(standalone, "public"), { recursive: true });
}

console.log("[prepare-standalone] static + public copied into standalone.");
