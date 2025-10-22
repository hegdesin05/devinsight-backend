import pool from "../config/postgres.js";

// GET all services
export const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Get Services Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST new service
export const addService = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO services (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add Service Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
