import SQL from "better-sqlite3";
const sql = new SQL("./database/blackhole.sqlite", { fileMustExist: false });
sql
  .prepare(`CREATE TABLE IF NOT EXISTS gravity (type TEXT PRIMARY KEY NOT NULL DEFAULT (?), domain TEXT UNIQUE NOT NULL, redirect TEXT NOT NULL DEFAULT (?))`)
  .run("allowed", "0.0.0.0");
sql.prepare(`CREATE TABLE IF NOT EXISTS counter (allowed INTEGER, blocked INTEGER)`).run();
if (!sql.prepare(`SELECT * FROM counter`).all().length) sql.prepare(`INSERT INTO counter (allowed, blocked) VALUES (?, ?)`).run(0, 0);
if(!sql.prepare(`SELECT * FROM gravity`).all().length) {}
export default sql;
