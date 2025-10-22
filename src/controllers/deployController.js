import pool from "../config/postgres.js";

// Deploy service
export const deployService = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get("io"); // Socket.IO instance

  try {
    await pool.query("UPDATE services SET status=$1 WHERE id=$2", [
      "deploying",
      id,
    ]);
    io.emit("serviceUpdate", { id, status: "deploying" });

    setTimeout(async () => {
      const success = Math.random() > 0.2;
      const newStatus = success ? "active" : "failed";
      const cpu = Math.floor(Math.random() * 80);
      const memory = Math.floor(Math.random() * 80);

      await pool.query(
        "UPDATE services SET status=$1, cpu_usage=$2, memory_usage=$3 WHERE id=$4",
        [newStatus, cpu, memory, id]
      );

      io.emit("serviceUpdate", {
        id,
        status: newStatus,
        cpu_usage: cpu,
        memory_usage: memory,
      });
    }, 3000);

    res.json({ success: true, message: "Deployment started 🚀" });
  } catch (err) {
    console.error("Deploy Service Error:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
