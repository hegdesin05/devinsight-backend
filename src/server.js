import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import deployRoutes from "./routes/deployRoutes.js";
import { connectMongo } from "./config/mongo.js";
import { connectPostgres } from "./config/postgres.js";

dotenv.config();
console.log("PG_URI =", process.env.PG_URI);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/deploy", deployRoutes);

// ✅ Test route
app.get("/api/ping", (req, res) => res.json({ message: "Server OK 🚀" }));

// ✅ Protected test route
app.get("/api/test-protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Access granted ✅", userId: decoded.id });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

// Start server and connect DBs
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectMongo();
    await connectPostgres();

    // Start server once
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // Socket.IO setup
    const io = new SocketIOServer(server, { cors: { origin: "*" } });
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("🔌 New client connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
