import fs from "fs-extra";
import process from "node:child_process";

const BuildSource = "./pages";
const BuildTarget = "./dist";

// Compile TypeScript
process.execSync("tsc");

// Clean build directory
fs.removeSync(BuildTarget);

// Copy source files, except TypeScript, to build directory
fs.copySync(BuildSource, BuildTarget, {
  filter: (source) => !source.endsWith(".ts"),
});
