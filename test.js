import os from "os";
import OS from "node-os-utils";
import { createRequire } from "module";
// console.log(process.cpuUsage(), process.memoryUsage)

setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`${Math.round(used * 100) / 100} MB - ${process.cpuUsage().system}`);
}, 1000);

