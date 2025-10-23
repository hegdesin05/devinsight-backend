import jwt from "jsonwebtoken";
import pool from "../config/postgres.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await pool.query(
      "SELECT id, username, email FROM users WHERE id=$1",
      [decoded.id]
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
