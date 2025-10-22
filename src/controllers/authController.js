import pool from "../config/postgres.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (userCheck.rows.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully ✅",
        user: result.rows[0],
      });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ success: true, message: "Login successful ✅", token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
