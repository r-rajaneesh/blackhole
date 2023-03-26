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
let row = 0;
socket.on("dns-query", (res) => {
  res.answers.push(...res.questions);
  [...new Set(res.answers)].forEach((d, i) => {
    row++;
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
      log.classList.add("table-danger");
      toggleButton.innerText = "Unblock";
      toggleButton.type = "1";
      toggleButton.classList.add("btn", "btn-success");
    } else {
      log.classList.add("table-success");
      toggleButton.type = "0";
      toggleButton.innerText = "Block";
      toggleButton.classList.add("btn", "btn-danger");
    }
    toggleButton.id = `adstate`;
    date.innerText = new Date().toLocaleTimeString();
    toggle.append(toggleButton);
    log.append(date, domain, clas, type, toggle);
    // if (row > 100) {
    //   // Delete ad log at the end of the table if more that 100 ads are queried
    //   const table = document.getElementById("logs");
    //   table.deleteRow(table.rows.length - 1);
    //   row--;
    // }
    // prepends ad log to the start of the table

    setTimeout(() => {
      document.getElementById("logs")?.prepend(log);
      $(`#adstate`).on("click", async function (ev) {
        ev.preventDefault();
        const domain = $(this).parent().attr("id");
        const type = $(this).attr("type") === "1" ? 1 : 0;
        const elm = $(this).parent().parent();
        if (elm.hasClass("table-danger")) {
          elm.removeClass("table-danger").addClass("table-success");
          $(this).removeClass("btn-success").addClass("btn-danger");
          ev.target.innerText = "Block";
        } else {
          elm.removeClass("table-success").addClass("table-danger");
          $(this).removeClass("btn-danger").addClass("btn-success");
          ev.target.innerText = "Unblock";
        }
        const data = (await axios.post("/api/updatetype", { domain: `${domain}`, type: type })).data.data;
        alert(`${data.domain} has been ${data.type}`);
      });
    }, i + Math.round(Math.random() * 27) + 1000);

    // Block or Unblock ad script
  });
});
