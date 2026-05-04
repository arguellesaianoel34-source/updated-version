import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rm } from "node:fs/promises";

const dir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(dir, "dist");
await rm(distDir, { recursive: true, force: true });

const repoRoot = path.resolve(dir, "..");

await build({
  entryPoints: [path.resolve(dir, "src/index.ts")],
  platform: "node",
  target: "node20",
  bundle: true,
  format: "esm",
  outfile: path.resolve(distDir, "index.mjs"),
  logLevel: "info",
  sourcemap: "linked",
  external: ["firebase-functions", "firebase-admin"],
  alias: {
    "@workspace/db": path.resolve(repoRoot, "lib/db/src/index.ts"),
    "@workspace/db/schema": path.resolve(repoRoot, "lib/db/src/schema/index.ts"),
    "@workspace/api-zod": path.resolve(repoRoot, "lib/api-zod/src/index.ts"),
  },
  banner: {
    js: `import { createRequire as __cr } from 'node:module';
import __p from 'node:path';
import __u from 'node:url';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __u.fileURLToPath(import.meta.url);
globalThis.__dirname = __p.dirname(globalThis.__filename);`,
  },
});
