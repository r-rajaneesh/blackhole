import axios from "axios";
import fs from "fs-extra";

const adLists = ["ads.csv", "test.txt"];

const adsdomain = [];
adLists.forEach(async (adlist) => {
  //   const {data:list} = await axios({ url: adlist, method: "GET" });
  const list = fs.readFileSync(adlist).toString();
  const ads = list
    .split("\n")
    .map((value) => value.replace("\r", "").trim())
    .filter((value) => {
      if (value.startsWith("#")) return;
      return value;
    });
  ads.forEach((ad) => {
    const adLine = ad.split(" ");
    const redirect = adLine[adLine.findIndex((v) => v === "0.0.0.0")] ?? "0.0.0.0";
    const domains = ad
      .split(" ")
      [adLine.findIndex((v) => v !== "0.0.0.0")].match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gm);
    if (!domains || !domains.length) return;
    domains.forEach((domain) => {
      if (!domain || !domain.length) return;
      adsdomain.push({ domain, redirect });
    });
  });
});
console.log(adsdomain.at(-2));
