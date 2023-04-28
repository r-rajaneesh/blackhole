import * as glob from "globby";
import * as socket from "socket.io";
import axios from "axios";
import cors from "cors";
import dns2 from "dns2";
import exit from "./handlers/exit.js";
import router from "./routes/api.js";
import express from "express";
import fs from "fs-extra";
import helmet from "helmet";
import http from "http";
import p from "path";
import pu from "pidusage";
import sql from "./handlers/db.js";
import url from "url";

/* Verify IF the database is properly created */
sql.prepare(`CREATE TABLE IF NOT EXISTS gravity (type TEXT PRIMARYKEY NOT NULL DEFAULT "blocked", domain TEXT UNIQUE, redirect text DEFAULT "0.0.0.0")`).run();
sql.prepare(`CREATE TABLE IF NOT EXISTS counter (allowed INTEGER, blocked INTEGER)`).run();
if (!sql.prepare(`SELECT * FROM counter`).all().length) sql.prepare(`INSERT INTO counter (allowed, blocked) VALUES (?, ?)`).run(0, 0);
let ads = sql.prepare(`SELECT * FROM counter`).get();

/* Check if everything is ready */
/* Live updates on domains */
let dnsQueries = {
  blocked: ads.blocked,
  allowed: ads.allowed,
};
const toggle = (() => {
  let state = false;
  function chk() {
    if (!state) state = true;
    else state = false;
    return state;
  }
  return { chk, state };
})();
/* Handle Exit */
exit(dnsQueries);
/* Send Updates to clients about the server */
setInterval(async () => {
  io.emit("updates", { dnsQueries, process: await pu(process.pid) });
}, 1000 * 5);
/* Declarations */
const __dirname = p.dirname(url.fileURLToPath(import.meta.url));
const domainCache = new Map<string, any>();
const app = express();
const server = http.createServer(app);
const io = new socket.Server();
io.attach(server);
console.log(__dirname);

// Temporarily pause/resume the DNS server
io.on("state", (currstate) => {
  toggle.chk();
});
/* Logger */
function logDNSrequest(responseAnswers: any) {
  const date = new Date();
  [...new Set(responseAnswers)].forEach((ans: any) => {
    console.log(ans);
    fs.ensureFileSync(`./logs/${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}-${date.getUTCHours()}.log`);
    fs.appendFileSync(
      `./logs/${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}-${date.getUTCHours()}.log`,
      `${date.toLocaleTimeString()} ${ans.domain} ${ans.allowed ? "Allowed" : "Blocked"}\n`,
    );
  });
}
// * DNS Initialiser
const dns = dns2.createServer({
  udp: true,
  tcp: true,
  handle: async (request, send, rinfo) => {
    // if (!toggle.state) return;
    const response = dns2.Packet.createResponseFromRequest(request);

    const question: any = request.questions[0];
    const { name: domain } = question;
    question.type = dns2.Packet.TYPE.A;
    question.class = dns2.Packet.CLASS.IN;

    let ad = sql.prepare(`SELECT * FROM gravity WHERE domain = (?)`).get(domain);
    if (!ad) sql.prepare(`INSERT INTO gravity (type, domain, redirect) VALUES (?, ?, ?)`).run("allowed", domain, "0.0.0.0");
    ad = sql.prepare(`SELECT * FROM gravity WHERE domain = (?)`).get(domain);
    if (ad?.type === "allowed") {
      /* Allowed Domains */
      axios
        .get(`https://dns.google.com/resolve?name=${domain}&type=A`)
        .then(async ({ data }) => {
          data?.Answer.forEach(async (ans: any) => {
            ans.allowed = true;
            ans.address = ans.data;
          });
          response.answers = data?.Answer;
          dnsQueries.allowed += 1;
        })
        .catch(console.log);
    } else {
      /* Blocked Domains */
      const res: any = {
        domain: domain,
        name: domain,
        type: dns2.Packet.TYPE.A,
        ttl: 0,
        class: dns2.Packet.CLASS.IN,
        address: "0.0.0.0",
        allowed: false,
      };
      response.answers.push(res);

      dnsQueries.blocked += 1;
    }
    /* Send standard response */
    logDNSrequest(response.answers);
    io.emit("dns-query", response);
    send(response);
  },
});

app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.set("views", p.join(__dirname, "views"));
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
app.use(express.static(p.join(__dirname, "public")));
app.use(express.static(p.join(__dirname, "source")));
app.use("/api", router);

app.use(async (req, res, next) => {
  res.setHeader("x-powered-by", "blackhole");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Security-Policy", "");
  next();
});
app.delete("/reset-stats", (req, res) => {
  dnsQueries.allowed = 0;
  dnsQueries.blocked = 0;
  res.status(200).json({ message: "Success, status cleared", status: 200 });
});
glob.globby(`src-old/views/`).then((paths) => {
  // console.log(paths);
  paths.forEach(async (path) => {
    /* Watch file changes */
    fs.watchFile(path, (currentState, previousState) => {
      io.emit("page-reload");
    });

    /* Process file path and server file path destination */
    if (!path || !path.length) return;
    if (path.split("/")[2].startsWith("!")) return;
    let serverPath = "";
    let Path: string[] = path.split("/");
    if (!Path.length) return;
    if (/index.(ejs|html)/g.test(path.split("/").pop() as string)) Path.pop();
    serverPath = `/${Path.join("/")}`;
    serverPath = serverPath.replace("/src-old/views", "");
    if (!serverPath.length) serverPath = "/";

    path = path.replace("src-old/views/", "");
    console.log(serverPath, path);
    app.get(serverPath, (req, res) => {
      if (!path.endsWith(".html")) return res.render(path);
      return res.sendFile(p.resolve(`${path}`));
    });
  });
});

// * DNS Handler
dns.on("request", () => {});
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
server.listen(80, "127.0.0.1", async () => {
  dns.listen({ tcp: 53, udp: 53 });
  console.log("Server running on http://127.0.0.1");
  if (!sql.prepare(`SELECT * FROM gravity`).all().length) {
    await axios({ method: "patch", url: "http://127.0.0.1:80/api/reset" });
  }
});

export { io };
