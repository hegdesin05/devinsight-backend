import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const connectPostgres = async () => {
  const pool = new Pool({
    connectionString: process.env.PG_URI,
  });

  try {
    await pool.connect();
    console.log("🟢 PostgreSQL connected");
  } catch (err) {
    console.error("🔴 PostgreSQL connection failed:", err.message);
  }

  return pool;
};
