import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const dashboard = path.resolve("apps/dashboard");

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") {
        continue;
      }
      files.push(...(await walk(full)));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function clientKind(file, source) {
  const rel = path.relative(dashboard, file);
  if (rel.startsWith(`lib${path.sep}client${path.sep}`)) {
    return "client-lib";
  }
  if (rel.startsWith(`components${path.sep}`)) {
    return "component";
  }
  const trimmed = source.trimStart();
  if (
    trimmed.startsWith('"use client"') ||
    trimmed.startsWith("'use client'")
  ) {
    return "use-client";
  }
  return null;
}

const files = await walk(dashboard);
const problems = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const kind = clientKind(file, source);
  if (!kind) {
    continue;
  }

  if (source.includes("@server/") || source.includes("lib/server")) {
    problems.push(`${path.relative(dashboard, file)} imports server code`);
  }

  const rel = path.relative(dashboard, file);
  const inClientLib = rel.startsWith(`lib${path.sep}client${path.sep}`);
  if (!inClientLib && /\bfetch\s*\(/.test(source)) {
    problems.push(
      `${path.relative(dashboard, file)} calls fetch directly. Put that call in lib/client.`,
    );
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("boundaries ok");
