import fs from "fs-extra";
import axios from "axios";
interface typeadsList {
  type: "allowed" | "blocked";
  domain: string;
  redirect: string;
}
const getDomains = async function (adLists: string[], type: "blocked" | "allowed" = "blocked"): Promise<typeadsList[]> {
  const adsdomain: typeadsList[] = [];
  return new Promise((res, rej) => {
    adLists.forEach(async (adList, adIndex) => {
      axios({ url: adList, method: "GET" })
        .then((val) => {
          const list = val.data;
          const ads = list
            .split("\n")
            .map((value: string) => value.replace("\r", "").trim())
            .filter((value: string) => {
              if (value.startsWith("#")) return;
              return value;
            });
          ads.forEach((ad: string) => {
            const splitad = ad.split(" ");
            let redirect = "0.0.0.0";
            let domain = splitad[0];
            if (splitad.length > 1) {
              redirect = splitad[0];
              domain = splitad[1];
            }
            domain = domain.replace("||", "").replace("^", "");
            adsdomain.push({ domain: domain, redirect: redirect, type: type });
          });
        })
        .then(() => {
          if (adLists.length === adIndex + 1) res(adsdomain);
        })
        .catch(console.log);
    });
  });
};
export default getDomains;
