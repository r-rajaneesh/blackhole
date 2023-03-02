import fs from "fs-extra";
fs.removeSync("build");
fs.copySync("src/views", "build/views");
fs.copySync("src/public", "build/public");
fs.copySync("src/source/style", "build/source/style");
fs.remove("/build/tsconfig.tsbuildinfo");
