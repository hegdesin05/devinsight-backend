import pool from "../config/postgres.js"; // Your PG pool

export async function createUser({ username, email, password }) {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email
  `;
  const values = [username, email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email=$1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
}
