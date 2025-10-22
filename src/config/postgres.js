import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Single pool instance
const pool = new Pool({ connectionString: process.env.PG_URI });

export const connectPostgres = async () => {
  try {
    await pool.connect();
    console.log("🟢 PostgreSQL connected");
  } catch (err) {
    console.error("🔴 PostgreSQL connection failed:", err.message);
  }
};

export default pool;
