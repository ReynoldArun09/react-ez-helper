#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { templates } from "./templates.js";

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
  const isTypescript = fs.existsSync(path.join(rootDir, "tsconfig.json"));

  let nextJsStructure = "app";
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

const { isNextJs, isTypescript, nextJsStructure } = detectProjectType();

const componentsDir = path.join(rootDir, "src", "components");
const pagesDir = isNextJs
  ? path.join(rootDir, "app")
  : path.join(rootDir, "src", "pages");
const hooksDir = path.join(rootDir, "src", "hooks");

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function generate(type, names, options) {
  let baseDir;
  let template;

  switch (type) {
    case "component":
    case "c":
    case "components":
      baseDir = componentsDir;
      template = templates.component;
      break;
    case "page":
    case "p":
    case "pages":
      baseDir = pagesDir;
      template = templates.page;
      break;
    case "hooks":
    case "h":
    case "hook":
      baseDir = hooksDir;
      template = templates.hook;
      break;
    default:
      console.error(`Invalid type: ${type}`);
      console.warn("Types: component(s) (c), hook(s) (h), page(s) (p)");
      return;
  }

  names.forEach((name) => {
    const subFolder = name.split("/");
    const filename = subFolder.pop();
    const capitializedName = capitalize(filename);

    let dir;
    let jsxFileName;
    let jsxFilePath;

    if (isNextJs && (type === "p" || type === "page" || type === "pages")) {
      dir = path.join(baseDir, ...subFolder, filename);
      jsxFileName = `page.${isTypescript ? "tsx" : "jsx"}`;
    } else {
      dir = path.join(baseDir, ...subFolder);
      jsxFileName = `${capitializedName}.${isTypescript ? "tsx" : "jsx"}`;
    }
    jsxFilePath = path.join(dir, jsxFileName);

    try {
      ensureDirectoryExistence(jsxFilePath);

      if (fs.existsSync(jsxFilePath)) {
        console.warn(`File already exists, skipping: ${jsxFilePath}`);
        return;
      }
      let cssImport = "";
      if (options.css || options.scss) {
        const styleExt = options.scss ? "scss" : "css";
        const styleFileName = `${capitializedName}.${styleExt}`;
        const styleFilePath = path.join(dir, styleFileName);
        const styleTemplate = options.scss ? templates.scss : templates.css;

        fs.writeFileSync(styleFilePath, styleTemplate(capitializedName));
        console.log(
          `Generated ${styleExt.toUpperCase()} file: ${styleFilePath}`
        );

        cssImport = `import './${styleFileName}';`;
      }

      fs.writeFileSync(jsxFilePath, template(capitializedName), cssImport);
      console.log(`Generated ${type}: ${jsxFilePath}`);
    } catch (error) {
      console.error(`Error generating ${type} ${name}:`, error.message);
    }
  });

  console.log(
    `Project type: ${isTypescript ? "TypeScript" : "JavaScript"}, ${
      isNextJs ? `Next.js (${nextJsStructure})` : "React"
    }`
  );
}

function main() {
  const [, , type, ...args] = process.argv;
  const options = {
    css: args.includes("--css"),
    scss: args.includes("--scss"),
  };
  const names = args.filter((arg) => !arg.startsWith("--"));

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

  generate(type, names, options);
}

main();
