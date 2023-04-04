import sql from "../database/db.js";
/* Handle Process Exit */
export default async function (ads: { blocked: number; allowed: number }) {
  function updateBlockedAds() {
    sql.prepare(`UPDATE counter SET blocked = (?), allowed = (?)`).run(ads.blocked, ads.allowed);
  }
  process.prependListener("beforeExit", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("exit", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("rejectionHandled", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("uncaughtException", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("uncaughtExceptionMonitor", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("unhandledRejection", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("warning", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGABRT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGALRM", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGBUS", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGCHLD", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGCONT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGFPE", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGHUP", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGILL", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGINT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGIO", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGIOT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGKILL", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGPIPE", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGPOLL", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGPROF", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGPWR", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGQUIT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGSEGV", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGSTKFLT", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGSTOP", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGSYS", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGTERM", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGTRAP", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGTSTP", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGTTIN", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGTTOU", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGUNUSED", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGURG", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGUSR1", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGUSR2", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGVTALRM", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGWINCH", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGXCPU", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGXFSZ", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGBREAK", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGLOST", (...args) => {
    console.log(args);
    updateBlockedAds();
  });

  process.prependListener("SIGINFO", (...args) => {
    console.log(args);
    updateBlockedAds();
  });
}
