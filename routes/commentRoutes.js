import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  addCommentController,
  deleteCommentController,
  getCommentController,
} from "../controllers/commentController.js";
const router = express.Router();

// Add a comment
router.post("/add/:courseId", isAuthenticated, addCommentController);

// Delete a comment (Admin only)
router.delete("/delete/:CourseId", isAuthenticated, deleteCommentController);

// Fetch comments by courseId
router.get("/:courseId/comments", isAuthenticated, getCommentController);

export default router;
