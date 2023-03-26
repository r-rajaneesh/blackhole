socket.on("updates", (data) => {
  let dnsQueries = data.dnsQueries;
  $("#total-allowed").text(dnsQueries.allowed);
  $("#total-blocked").text(dnsQueries.blocked);
  $("#total-queries").text(dnsQueries.blocked + dnsQueries.allowed);
});
