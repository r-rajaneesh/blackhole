import * as glob from "glob";
import fs from "fs-extra";
import dns2 from "dns2";
import axios from "axios";
import sql from "../helpers/sql.js";
type response = {
  answers: answers;
};
type answers = {
  domain: string;
  name: string;
  address: string;
  type: number;
  class: number;
  ttl: number;
  TTL?: number;
  allowed: boolean;
  data: any;
};
type filteredAnswers = { name: string; class: number; type: number; ttl: number; allowed: boolean };
type storedDomain = {
  type: "allowed" | "blocked";
  domain: string;
  redirect: string;
};
type ILookupResponse = {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: {
    name: string;
    type: number;
  }[];
  Answer: {
    name: string;
    type: number;
    TTL: number;
    data: string;
  }[];
};

/* DNS SERVER */
const DNS = dns2.createServer({
  udp: true,
  tcp: true,
  handle: (request, send, rinfo) => {
    const response = dns2.Packet.createResponseFromRequest(request);
    request.questions.forEach((question) => {
      const domain = question.name;

      let data: storedDomain = sql.prepare(`SELECT * FROM gravity WHERE = (?)`).get(domain);
      if (!data) {
        sql.prepare(`INSERT INTO gravity (type, domain, redirect) VALUES(?, ?, ?)`).run("allowed", domain, "0.0.0.0");
        data = sql.prepare(`SELECT * FROM gravity WHERE = (?)`).get(domain);
      }
      if (data.type === "blocked") {
      } else {
        axios({ url: `https://dns.google.com/resolve?name=${domain}&type=A`, method: "GET" })
          .then(async ({ data }: { data: ILookupResponse }) => {
            const filteredData: filteredAnswers[] = data?.Answer.map((ans: any) => {
              ans.allowed = true;
              ans.address = ans.data;
              ans.ttl = ans.TTL ?? 0;
              delete ans.TTL;
              ans.class = dns2.Packet.CLASS.IN;

              // ans.type = dns2.Packet.TYPE.A;
              return ans;
            });

            response.answers = filteredData;
          })
          .catch(console.log);
      }
    });
  },
});
export default DNS;
