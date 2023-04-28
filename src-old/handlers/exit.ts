import sql from "./db.js";
import pico from "picocolors";
/* Handle Process Exit */
export default async function exit(ads: { blocked: number; allowed: number }) {
  function updateBlockedAds(event: string, args: any[]) {
    new Promise((res, rej) => {
      sql.prepare(`UPDATE counter SET blocked = (?), allowed = (?)`).run(ads.blocked, ads.allowed);
      console.log(`[${pico.red("ERROR")}] ${pico.bold(event)}\n`, ...args.slice(0, -1));
      // console.log(args);
      res(true);
    }).then(() => {
      process.exit();
    });
  }

  [
    "SIGABRT",
    "SIGALRM",
    "SIGBUS",
    "SIGCHLD",
    "SIGCONT",
    "SIGFPE",
    "SIGHUP",
    "SIGILL",
    "SIGINT",
    "SIGIO",
    "SIGIOT",
    "SIGKILL",
    "SIGPIPE",
    "SIGPOLL",
    "SIGPROF",
    "SIGPWR",
    "SIGQUIT",
    "SIGSEGV",
    "SIGSTKFLT",
    "SIGSTOP",
    "SIGSYS",
    "SIGTERM",
    "SIGTRAP",
    "SIGTSTP",
    "SIGTTIN",
    "SIGTTOU",
    "SIGUNUSED",
    "SIGURG",
    "SIGUSR1",
    "SIGUSR2",
    "SIGVTALRM",
    "SIGWINCH",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGBREAK",
    "SIGLOST",
    "SIGINFO",
    "beforeExit",
    "disconnect",
    "exit",
    "rejectionHandled",
    "uncaughtException",
    "uncaughtExceptionMonitor",
    "unhandledRejection",
    "warning",
    "message",
    "worker",
  ].forEach((signal: any) =>
    process.prependListener(signal, (...args) => {
      updateBlockedAds(signal, args);
    }),
  );
}
