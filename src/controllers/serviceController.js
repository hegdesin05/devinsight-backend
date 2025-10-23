import pool from "../config/postgres.js";

// ✅ Get all services
export const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Get Services Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Add a new service
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

// ✅ Update service status or usage
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { status, cpu_usage, memory_usage } = req.body;

  try {
    const result = await pool.query(
      "UPDATE services SET status=$1, cpu_usage=$2, memory_usage=$3 WHERE id=$4 RETURNING *",
      [status, cpu_usage, memory_usage, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service updated ✅", service: result.rows[0] });
  } catch (err) {
    console.error("Update Service Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a service
export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM services WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service deleted 🗑️" });
  } catch (err) {
    console.error("Delete Service Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
