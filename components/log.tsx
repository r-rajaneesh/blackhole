"use client";
import style from "../styles/components/log.module.scss";
import React from "react";
import io from "socket.io-client";
import $ from "jquery";
import axios from "axios";
const socket = io();
interface response {
  type: number;
  name: string;
  domain: string;
  class: number;
  ttl: number;
  address: string;
}
export default function Logs() {
  const TYPE: any = {
    "1": "A",
    "2": "NS",
    "3": "MD",
    "4": "MF",
    "5": "CNAME",
    "6": "SOA",
    "7": "MB",
    "8": "MG",
    "9": "MR",
    "10": "NULL",
    "11": "WKS",
    "12": "PTR",
    "13": "HINFO",
    "14": "MINFO",
    "15": "MX",
    "16": "TXT",
    "28": "AAAA",
    "33": "SRV",
    "41": "EDNS",
    "99": "SPF",
    "252": "AXFR",
    "253": "MAILB",
    "254": "MAILA",
    "255": "ANY",
    "257": "CAA",
  };
  const CLASS: any = {
    "1": "IN",
    "2": "CS",
    "3": "CH",
    "4": "HS",
    "255": "ANY",
  };
  React.useEffect(() => {
    socket.on("dns-query", (res) => {
      res.answers.push(...res.questions);
      const queries: response[] = [];
      res.answers.forEach((a: response) => {
        if (queries.find((q) => q.domain !== a.domain)) queries.push(a);
      });
      queries.forEach((d: response) => {
        const log = document.createElement("tr");

        const domain = document.createElement("td");
        domain.append(d.domain ?? d.name);
        const clas = document.createElement("td");
        clas.append(CLASS[`${d.class}`]);
        const type = document.createElement("td");
        type.append(TYPE[`${d.type}`]);

        const toggle = document.createElement("td");
        toggle.id = d.domain ?? d.name;
        let toggleButton: any = document.createElement("button");
        if (!d.address) {
          log.className += `${style.question}`;
          toggleButton = document.createElement("span");
        } else if (d?.address === "0.0.0.0") {
          log.className += `${style.blocked}`;
          toggleButton.innerText = "Unblock";
          toggleButton.type = "1";
        } else {
          log.className += `${style.allowed}`;
          toggleButton.type = "0";
          toggleButton.innerText = "Block";
        }
        toggleButton.id = "adstate";

        toggle.append(toggleButton);
        log.append(domain, clas, type, toggle);
        document.getElementById("logs")?.prepend(log);

        $("#adstate").on("click", async function (ev) {
          ev.preventDefault();
          const domain = $(this).parent().attr("id");
          const type = $(this).attr("type") === "1" ? 1 : 0;

          await axios.post("/api/updatetype", { domain: `${domain}`, type: type });
        });
      });
    });
  }, []);
  return (
    <>
      <table className={`${style.log}`}>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Class</th>
            <th>Type</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody id="logs"></tbody>
      </table>
    </>
  );
}
