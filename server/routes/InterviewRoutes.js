import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateQuestion,
  submitAnswer,
  getInterviewHistory,
  getDashboardStats
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/question", authMiddleware, generateQuestion);
router.post("/submit", authMiddleware, submitAnswer);
router.get("/history", authMiddleware, getInterviewHistory);
router.get("/dashboard", authMiddleware, getDashboardStats);

export default router;