import apiRouter from "./routes/api/ads.js";
import express from "express";
import cors from "cors";
import * as glob from "globby";
import helmet from "helmet";
import Path from "path";
import url from "url";
import next from "next";
import axios from "axios";
import dgram from "dgram";
import dns2 from "dns2";
import fs from "fs-extra";
import http from "http";
import * as socket from "socket.io";
import sql from "./routes/db.js";
import path from "path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const { Packet } = dns2;
const dev = process.env.NODE_ENV !== "production";
// const dev = false;
const hostname = "localhost";
const port = 80;

let ads: Map<string, { type: number; redirect: string }>;
interface dbMapOptions {
  domain: string;
  type: number;
  redirect: string;
}
try {
  ads = new Map(
    sql
      .prepare(`SELECT * FROM gravity`)
      .all()
      .map((v: dbMapOptions) => [v.domain, { type: v.type, redirect: v.redirect }]),
  );
} catch (error) {
  ads = new Map();
}
/* Run every 5 Mins */
setInterval(() => {
  ads = new Map(
    sql
      .prepare(`SELECT * FROM gravity`)
      .all()
      .map((v: dbMapOptions) => [v.domain, { type: v.type, redirect: v.redirect }]),
  );
}, 5 * 60 * 1000);

// * Next Server Initialiser
const app = next({ port, hostname, dev });
// * Web Server Initialiser
const server = express();
const frame = http.createServer(server);
// * Socket.io Server Initialiser
const io = new socket.Server(frame);
// * DNS Initialiser
const dns = dns2.createServer({
  udp: true,
  tcp: true,
  handle: async (request, send, rinfo) => {
    const response = Packet.createResponseFromRequest(request);

    const question: any = request.questions[0];
    const { name: domain } = question;
    question.type = Packet.TYPE.A;
    question.class = Packet.CLASS.IN;
    async function blockDomain() {
      const res: any = {
        domain: domain,
        name: domain,
        type: Packet.TYPE.A,
        ttl: 0,
        class: Packet.CLASS.IN,
        address: "0.0.0.0",
      };
      response.answers.push(res);
      io.emit("dns-query", response);
      // console.log(`Blocked domain ${domain}\n`);
      send(response);
    }
    async function allowDomain() {
      Promise.resolve(await new dns2().resolveA(domain)).then(async (res) => {
        res.answers.forEach(async (ans) => {
          if (ads.has(ans.domain ?? ans.name)) {
            const ad = ads.get(domain);
            if (!ad?.type) {
              ans.ttl = 0;
              ans.address = "0.0.0.0";
            }
          }
        });
        response.answers = res.answers;
        io.emit("dns-query", response);
        send(response);
      });
    }
    if (ads.has(domain)) {
      const ad = ads.get(domain);
      if (ad?.type) {
        allowDomain();
      } else {
        blockDomain();
      }
    } else {
      allowDomain();
    }
  },
});

// * Web Server Handler
server.set("trust proxy", 1);
server.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
server.use(helmet());
server.use(express.json());
server.use(express.static(path.join(__dirname, "public")));
server.use(async (req, res, next) => {
  res.setHeader("x-powered-by", "blackhole");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Security-Policy", "");

  next();
});
const handle = app.getRequestHandler();
server.use("/api", apiRouter);

server.post("/api/refreshgravity", async (req, res) => {
  try {
    ads = new Map(
      sql
        .prepare(`SELECT * FROM gravity`)
        .all()
        .map((v: dbMapOptions) => [v.domain, { type: v.type, redirect: v.redirect }]),
    );
    res.status(200).json({ message: "SUCCESS", status: 200, data: undefined });
  } catch (error) {
    res.status(400).json({ message: "ERROR", status: 400, data: undefined });
  }
});

server.use((req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);
  } catch (error) {}
});
// Dynamic Pages
// const paths = glob.globbySync("./src/pages/**").reverse();

// paths.forEach(async (path) => {
//   let p = path.replace("/index.html", "/").replace("./src/pages", "").replace(".html", "");

//   if (p.includes("404")) p = "*";
//   const file = Path.join(__dirname, ...path.replace("./", "").split("/"));

//   server.get(p, async (req, res) => {
//     res.status(200).sendFile(file);
//   });
// });

// * Listeners
app.prepare().then(() => {
  frame.listen(port, () => {
    console.log(` Ready on http://127.0.0.1:${port}`);
  });
  dns.listen({ tcp: 53, udp: 53 });
});
// * DNS Handler
dns.on("request", (request, response, rinfo) => {});
dns.on("requestError", (error) => {
  console.log("Client sent an invalid request", error);
});

dns.on("listening", () => {
  // console.log(dns.addresses());
  console.log(
    ` Listening to ${Object.keys(dns.addresses())
      .map((v) => v.toUpperCase())
      .join(" and ")} on port 53 `,
  );
});

dns.on("close", () => {
  console.log("server closed");
});
