import Sqlite from "better-sqlite3";
const sql = Sqlite("./database/blackhole.sqlite", { fileMustExist: false });
export default sql;
