#!/usr/bin/env node

import fs from "fs";
import path from "path";

const rootDir = process.cwd();

export function detectProjectType() {
  const packageJsonPath = path.join(rootDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      "package.json not found. Are you in the project root directory?"
    );
    process.exit(1);
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const isNextJs =
    packageJson.dependencies && "next" in packageJson.dependencies;
  const isTypescript = path.join(rootDir, "tsconfig.json");

  let nextJsStructure;
  if (isNextJs) {
    if (fs.existsSync(path.join(rootDir, "src", "app"))) {
      nextJsStructure = "src/app";
    } else if (fs.existsSync(path.join(rootDir, "app"))) {
      nextJsStructure = "app";
    } else if (fs.existsSync(path.join(rootDir, "src", "pages"))) {
      nextJsStructure = "src/pages";
    }
  }

  return { isNextJs, isTypescript, nextJsStructure };
}
