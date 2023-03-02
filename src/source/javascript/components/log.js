const socket = io("ws://127.0.0.1:80");
socket.on("page-reload", () => {
  document.location.reload();
});
const TYPE = {
  1: "A",
  2: "NS",
  3: "MD",
  4: "MF",
  5: "CNAME",
  6: "SOA",
  7: "MB",
  8: "MG",
  9: "MR",
  10: "NULL",
  11: "WKS",
  12: "PTR",
  13: "HINFO",
  14: "MINFO",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV",
  41: "EDNS",
  99: "SPF",
  252: "AXFR",
  253: "MAILB",
  254: "MAILA",
  255: "ANY",
  257: "CAA",
};
const CLASS = {
  1: "IN",
  2: "CS",
  3: "CH",
  4: "HS",
  255: "ANY",
};
socket.on("dns-query", (res) => {
  res.answers.push(...res.questions);
  [...new Set(res.answers)].forEach((d) => {
    const log = document.createElement("tr");

    const domain = document.createElement("td");
    domain.append(d.domain ?? d.name);
    const clas = document.createElement("td");
    clas.append(CLASS[`${d.class}`]);
    const type = document.createElement("td");
    type.append(TYPE[`${d.type}`]);
    const date = document.createElement("td");

    const toggle = document.createElement("td");
    toggle.id = d.domain ?? d.name;
    let toggleButton = document.createElement("button");
    // console.log(d);
    if (!d.address) log.classList.add("question");
    if (!d?.allowed) {
      log.classList.add("blocked");
      toggleButton.innerText = "Unblock";
      toggleButton.type = "1";
    } else {
      log.classList.add("allowed");
      toggleButton.type = "0";
      toggleButton.innerText = "Block";
    }
    toggleButton.id = "adstate";
    date.innerText = new Date().toLocaleTimeString()
    toggle.append(toggleButton);
    log.append(date, domain, clas, type, toggle);
    document.getElementById("logs")?.prepend(log);
    $("#adstate").on("click", async function (ev) {
      ev.preventDefault();
      const domain = $(this).parent().attr("id");
      const type = $(this).attr("type") === "1" ? 1 : 0;
      const data = (await axios.post("/api/updatetype", { domain: `${domain}`, type: type })).data.data;
      alert(`${data.domain} has been ${data.type}`);
    });
  });
});
