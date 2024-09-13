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


function generate(type, names, options) {
    console.log('type:'+ type)
    console.log('names:'+ names)
    console.log('options:'+ options)
}


function main() {
  const [, , type, ...args] = process.argv;
  const options = {
    css: args.includes("--css"),
    scss: args.includes("--scss"),
  };
  const names = args.filter((arg) => !arg.startsWith("--"));

  console.log(names)

  if (!type || !names.length === 0) {
    console.error(
      "Usage: npx generate <type> <name1> [name2] [name3] ... [options]"
    );
    console.error("Types: component(s) (c), hook(s) (h), page(s) (p)");
    console.error("Options: --css, --scss");
    console.error(
      "Example: npx generate components Header About Services --scss"
    );
    process.exit(1);
  }

  generate(type, names, options)
}


main()
