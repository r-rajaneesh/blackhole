import dns from "./servers/dns.js";
import web from "./servers/web.js";

web.server.listen(80, "0.0.0.0", () => {
  dns.listen({ tcp: 53, udp: 53 });
});
