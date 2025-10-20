import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

console.log("Connecting to:", process.env.PG_URI);

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Postgres error:", err.message);
  } else {
    console.log("✅ Postgres connected:", res.rows[0]);
  }
  pool.end();
});
