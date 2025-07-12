import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getArticlesByCategory,
  getCategoryByIdController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Routes for Category
router.post("/create-category", isAuthenticated, createCategoryController);
router.get("/categories", getCategoryController);
router.get("/categories/:id", getCategoryByIdController);
router.put("/categories/:id", isAuthenticated, updateCategoryController);
router.delete("/categories/:id", isAuthenticated, deleteCategoryController);
router.get("/category-detail/:categoryId", isAuthenticated, getArticlesByCategory);

export default router;
