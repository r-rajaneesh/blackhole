import https from "node:https";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as socket from "socket.io";
import fs from "fs-extra";
import * as glob from "globby";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
/* Expressjs Framework */
const app = express();
/* Basic https server */
const server = https.createServer(app);
/* For Realtime Connection */
const io = new socket.Server();
io.attach(server);
app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "src", "views")));
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use((req, res, next) => {
  res.setHeader("x-powered-by", "blackhole");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Security-Policy", "");
  next();
});
glob.globbySync(`../views/**`)
export default { app, io, server };
