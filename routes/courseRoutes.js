import express from "express";
import {
  createCourseController,
  deleteCourseController,
  getAllPublishedCourses,
  getCourseById,
  getCreatorCourses,
  summarizeCourseDescription,
  togglePublishCourse,
  updateCourseController,
  getArticlesByCategory,
} from "../controllers/courseController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  upload.single("courseThumbnail"),
  createCourseController
);

router.get("/", isAuthenticated, getCreatorCourses);
router.get("/published-courses", getAllPublishedCourses);
router.put(
  "/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  updateCourseController
);

router.get(
  "/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  getCourseById
);

router.delete("/:courseId", isAuthenticated, deleteCourseController);
router.patch("/:courseId", isAuthenticated, togglePublishCourse);
router.post("/:courseId/summarize", summarizeCourseDescription);
router.get("/related/:courseId", getArticlesByCategory);

export default router;
