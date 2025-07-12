import {
  registerController,
  loginContoller,
  logoutController,
  getUserProfileController,
  updateUserController,
  forgotController,
  addBookmark,
  removeBookmark,
  getBookmarks,
  readingHistoryController,
  getUserReadingHistoryController,
} from "../controllers/userController.js";
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginContoller);
router.post("/forgotpassword", forgotController);
router.get("/logout", logoutController);
router.get("/profile", isAuthenticated, getUserProfileController);
router.post("/bookmark/:courseId", isAuthenticated, addBookmark);
router.delete("/bookmark/:courseId", isAuthenticated, removeBookmark);
router.get("/bookmarks", isAuthenticated, getBookmarks);
router.put(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "bannerPhoto", maxCount: 1 },
  ]),
  updateUserController
);

router.post("/history/read", readingHistoryController);
router.get(
  "/reading-history",
  isAuthenticated,
  getUserReadingHistoryController
);
export default router;
