import * as glob from "globby";
import * as socket from "socket.io";
import apiRouter from "./routes/api/ads.js";
import cors from "cors";
import dns2 from "dns2";
import express from "express";
import fs from "fs-extra";
import helmet from "helmet";
import http from "http";
import p from "path";
import sql from "./routes/db.js";
import url from "url";

const __dirname = p.dirname(url.fileURLToPath(import.meta.url));
const { Packet } = dns2;

const app = express();
const server = http.createServer(app);
const io = new socket.Server();
io.attach(server);

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
    async function blockDomain(ad:any) {
      const res: any = {
        domain: domain,
        name: domain,
        type: Packet.TYPE.A,
        ttl: 0,
        class: Packet.CLASS.IN,
        address: "0.0.0.0",
        allowed: 0,
      };
      response.answers.push(res);
      io.emit("dns-query", response);
      // console.log(`Blocked domain ${domain}\n`);
      send(response);
    }
    async function allowDomain(ad:any) {
      Promise.resolve(await new dns2().resolveA(domain)).then(async (res) => {
        res.answers.forEach(async (ans) => {
          if (!ad?.type) {
            ans.ttl = 0;
            ans.address = "0.0.0.0";
            ans.allowed = 0;
          } else {
            ans.allowed = 1;
          }
        });
        response.answers = res.answers;
        io.emit("dns-query", response);
        send(response);
      });
    }

    const ad = sql.prepare(`SELECT * FROM gravity WHERE domain = (?)`).get(domain);
    if (!ad) sql.prepare(`INSERT INTO gravity (type, domain, redirect) VALUES (?, ?, ?)`).run(1, domain, "0.0.0.0");
    console.log(domain, sql.prepare(`SELECT * FROM gravity WHERE domain = (?)`).get(domain));
    if (ad?.type) {
      allowDomain(ad);
    } else {
      blockDomain(ad);
    }
  },
});

app.set("view engine", "ejs");
app.set("views", "src");
app.set("trust proxy", 1);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(helmet());
app.use(express.json());
app.use(express.static(p.join(__dirname, "public")));
app.use("/api", apiRouter);
app.use(async (req, res, next) => {
  res.setHeader("x-powered-by", "blackhole");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Security-Policy", "");

  next();
});

glob.globby("src/**").then((paths) => {
  paths.forEach(async (path) => {
    /* Watch file changes */
    fs.watchFile(path, (currentState, previousState) => {
      io.emit("page-reload");
    });

    /* Process file path and server file path destination */
    if (!path || !path.length) return;
    if (path.split("/")[1].startsWith("!")) return;
    let serverPath = "";
    let Path: string[] = path.split("/");
    if (!Path.length) return;
    if (/index.(ejs|html)/g.test(path.split("/").pop() as string)) Path.pop();
    serverPath = `/${Path.join("/")}`;
    serverPath = serverPath.replace("/src", "");
    if (!serverPath.length) serverPath = "/";

    path = path.replace("src/", "");
    console.log(serverPath, path);
    app.get(serverPath, (req, res) => {
      if (!path.endsWith(".html")) return res.render(path);
      return res.sendFile(p.resolve(`src/${path}`));
    });
  });
});

// * DNS Handler
dns.on("request", (request, response, rinfo) => {});
dns.on("requestError", (error) => {
  console.log("Client sent an invalid request", error);
});

dns.on("listening", () => {
  console.log(
    ` Listening to ${Object.keys(dns.addresses())
      .map((v) => v.toUpperCase())
      .join(" and ")} on port 53 `,
  );
});

dns.on("close", () => {
  console.log("server closed");
});

/* Start the servers */
server.listen(80, "0.0.0.0", () => {
  dns.listen({ tcp: 53, udp: 53 });
  console.log("Server running on http://127.0.0.1");
});
