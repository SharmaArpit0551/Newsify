import { Category } from "../models/category.js";
import { Course } from "../models/course.js";

//CRUD Category

//Create Catgeory
export const createCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({ message: "Category already exists" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error,
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching categories",
      error,
    });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching category",
      error,
    });
  }
};

// Update a category
export const updateCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating category",
      error,
    });
  }
};

// Delete a category
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting category",
      error,
    });
  }
};

export const getArticlesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const articles = await Course.find({ category: categoryId })
      .populate("creator", "name photoUrl")
      .populate("tags", "name");

    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found for this category" });
    }
 
    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
