import dotenv from "dotenv";
dotenv.config();
console.log("PG_URI =", process.env.PG_URI);

import express from "express";
import cors from "cors";
import { connectMongo } from "./config/mongo.js";
import { connectPostgres } from "./config/postgres.js";

const app = express();

app.use(cors());
app.use(express.json());

// sample route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Server OK 🚀" });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await connectMongo();
  await connectPostgres();
});
