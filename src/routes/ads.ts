import express from "express";
import sql from "../database/db.js";
import axios from "axios";
const router = express.Router();
router.use(express.json());
interface typeadsList {
  type: number;
  domain: string;
  redirect: string;
}
router.get("/fetch", async (req, res) => {
  try {
    res.status(200).json({ message: "SUCCESS", status: 200, data: sql.prepare(`SELECT * FROM gravity`).all() });
  } catch (error) {
    res.status(400).json({ message: "FAILED", status: 400, data: undefined });
    console.log(error);
  }
});
router.post("/updatetype", async (req, res) => {
  try {
    let body: any;
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      body = req.body;
    }
    const query = sql.prepare(`SELECT * FROM gravity WHERE domain = (?)`).get(`${body?.domain}`);
    if (!query) sql.prepare(`INSERT INTO gravity (type, domain) VALUES ((?), (?))`).run(0, `${body?.domain}`);

    sql.prepare(`UPDATE gravity SET type = (?) WHERE domain = (?)`).run(body.type, `${body?.domain}`);

    res.status(200).json({ message: "SUCCESS", status: 200, data: { domain: `${body?.domain}`, type: body?.type ? "Allowed" : "Blocked" } });
  } catch (error) {
    res.status(400).json({ message: "FAILED", status: 400, data: undefined });
    console.log(error);
  }
});
router.post("/blockone", async (req, res) => {
  try {
    const db = sql.prepare(`INSERT INTO gravity (type, domain) VALUES (@type, @domain)`);
    let body: any;
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      body = req.body;
    }
    const adsList: typeadsList[] = [];
    adsList.push({ domain: body.domain, type: 0, redirect: "0.0.0.0" });
    const insertMany = sql.transaction((data: any) => {
      for (const record of data) {
        try {
          db.run(record);
        } catch (error) {}
      }
    });

    const cleanadsList = [...new Set(adsList)];
    insertMany(cleanadsList);
    res.status(200).json({ message: "SUCCESS", statusCode: 200, data: { length: cleanadsList.length } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "FALIED", statusCode: 400, data: undefined });
  }
});
router.post("/block", async (req, res) => {
  try {
    //   sql.prepare(`CREATE TABLE IF NOT EXISTS gravity (type integer primarykey, domain text unique)`).run();
    const db = sql.prepare(`INSERT INTO gravity (type, domain, redirect) VALUES (@type, @domain, @redirect)`);

    let body: any;
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      body = req.body;
    }
    const adsList: typeadsList[] = [];

    const adsfile = (await axios.get(body.domain)).data;
    const ads: string[] = adsfile.split("\n").filter((line: string) => !line.startsWith("#"));
    ads.forEach((ad) => {
      const query = ad
        .split(" ")
        .filter((v) => v !== "\r")
        .filter((v) => v !== "")
        .map((v) => {
          if (v.endsWith("\r")) v = v.replace("\r", "");
          return v;
        });
      if (!query.length) return;
      let domain;
      if (query.length > 1) domain = query[1];
      else domain = query[0];
      if (domain !== ("" || undefined || null)) adsList.push({ type: body.type, domain: domain, redirect: body.type === 1 ? `${body.redirect}` : "0.0.0.0" });
    });
    const insertMany = sql.transaction((data: any) => {
      for (const record of data) {
        try {
          db.run(record);
        } catch (error) {}
      }
    });
    const cleanadsList = [...new Set(adsList)];
    insertMany(cleanadsList);
    res.status(200).json({ message: "SUCCESS", statusCode: 200, data: { length: cleanadsList.length } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "FALIED", statusCode: 400, data: undefined });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    sql.prepare(`DELETE FROM gravity WHERE domain = (?)`).run(req.body.domain);
    res.status(200).json({ message: "SUCCESS", status: 200, data: undefined });
  } catch (error) {
    res.status(400).json({ message: "ERROR", status: 400, data: undefined });
  }
});
router.delete("/reset", async (req, res) => {
  try {
    sql.prepare(`CREATE TABLE IF NOT EXISTS gravity (type INTEGER PRIMARYKEY, domain TEXT UNIQUE, redirect text DEFAULT "0.0.0.0")`).run();
    sql.prepare(`DELETE FROM gravity`).run();
    const adLists = [
      "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
      "https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt",
      "https://www.github.developerdan.com/hosts/lists/dating-services-extended.txt",
      "https://www.github.developerdan.com/hosts/lists/hate-and-junk-extended.txt",
      "https://www.github.developerdan.com/hosts/lists/tracking-aggressive-extended.txt",
      "https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts",
      "https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt",
      "https://v.firebog.net/hosts/AdguardDNS.txt",
      "https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts",
      "https://raw.githubusercontent.com/Jigsaw88/Spotify-Ad-List/main/Spotify%20Adblock.txt",
      "https://raw.githubusercontent.com/root-host/Spotify-AdBlock/master/domains2",
      "https://adaway.org/hosts.txt",
      "https://v.firebog.net/hosts/Easyprivacy.txt",
      "https://raw.githubusercontent.com/x0uid/SpotifyAdBlock/master/SpotifyBlocklist.txt",
      "https://gist.githubusercontent.com/Gaunah/5a439af3858ab568ec3418355d84d000/raw/dbe2c895cbe9101b2a3ee59791c13f095e4eed00/SpotifyAdList",
    ];
    const db = sql.prepare(`INSERT INTO gravity (type, domain, redirect) VALUES (@type, @domain, @redirect)`);
    const insertMany = sql.transaction((data: any) => {
      for (const record of data) {
        try {
          db.run(record);
        } catch (error) {}
      }
    });

    const adsList: typeadsList[] = [];
    adLists.forEach(async (adlist, i) => {
      const adsfile = (await axios.get(adlist)).data;
      const ads = adsfile.split("\n").filter((line: string) => !line.startsWith("#"));
      ads.forEach(async (ad: string) => {
        const query = ad
          .split(" ")
          .filter((v: string) => v !== "\r")
          .filter((v: string) => v !== "")
          .map((v: string) => {
            if (v.endsWith("\r")) v = v.replace("\r", "");
            return v;
          });
        if (!query.length) return;
        let domain;
        if (query.length > 1) domain = query[1];
        else domain = query[0];
        adsList.push({ type: 0, domain: domain, redirect: "0.0.0.0" });
      });
    });
    setTimeout(async () => {
      insertMany(adsList);
      res.status(200).json({ message: "SUCCESS", status: 200, data: undefined });
    }, 10000);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "ERROR", status: 400, data: undefined });
  }
});

export default router;
