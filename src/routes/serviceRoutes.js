import express from "express";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/", authMiddleware, getServices);
router.post("/", authMiddleware, addService);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

export default router;
