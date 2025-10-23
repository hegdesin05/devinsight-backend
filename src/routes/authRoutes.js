import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "User fetched successfully",
    user: req.user,
  });
});

export default router;
