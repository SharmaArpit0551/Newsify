import { Course } from "../models/course.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export const createCourseController = async (req, res) => {
  try {
    const {
      articleTitle,
      subTitle,
      description,
      category,
      tags,
      publishedAt,
      readingTime,
    } = req.body;

    const articleThumbnail = req.file;

    if (!articleTitle || !category || !tags) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let updatedArticleThumbnail = await uploadMedia(articleThumbnail.path);

    const course = await Course.create({
      articleTitle,
      subTitle,
      articleThumbnail: updatedArticleThumbnail?.secure_url || "",
      description,
      category,
      tags,
      publishedAt,
      readingTime,
      creator: req.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Article Created Successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Article Not Created",
      error: error.message,
    });
  }
};

export const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: "creator",
        select: "name photoUrl",
      })
      .populate({
        path: "tags",
      })
      .populate({
        path: "category",
      })
      .sort({ createdAt: -1 });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
  }
};

export const updateCourseController = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { articleTitle, subTitle, isPublished, publishedAt, readingTime } =
      req.body;

    const articleThumbnail = req.file;

    // Validate required fields
    if (!articleTitle) {
      return res.status(400).send({
        success: false,
        message: "Article title and category are required to update the course",
      });
    }

    // Fetch the course from the database
    let course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course Not Found" });
    }

    let updatedArticleThumbnail;
    if (articleThumbnail) {
      // Check if the course already has a thumbnail and delete it from Cloudinary if present
      if (course.articleThumbnail) {
        const publicId = course.articleThumbnail.split("/").pop().split(".")[0];
        // Delete old thumbnail from Cloudinary
        await deleteMediaFromCloudinary(publicId);
      }
      // Upload new thumbnail to Cloudinary
      updatedArticleThumbnail = await uploadMedia(articleThumbnail.path);
    }

    // Prepare updated data for the course
    const updatedData = {
      articleTitle,
      subTitle,
      articleThumbnail:
        updatedArticleThumbnail?.secure_url || course.articleThumbnail,
      isPublished: isPublished !== undefined ? isPublished : course.isPublished,
      publishedAt:
        isPublished && !course.publishedAt ? new Date() : publishedAt,
      readingTime,
    };

    // Update the course
    course = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
    });

    return res
      .status(200)
      .send({ success: true, message: "Article Updated Successfully", course });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went wrong while updating the Article",
      error,
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).send({ message: "Courses not Found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Courses Fetched", courses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something Went wrong while Fetching course", error });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const article = await Course.findById(courseId)
      .populate({
        path: "creator",
        select: "name photoUrl",
      })
      .populate({ path: "category", select: "name" })
      .populate({ path: "tags", select: "name" });
    return res.status(200).send({
      message: "Course Fetched Successfully By Id",
      success: true,
      article,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in fetching Course By Id" });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //true false
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course Not Found" });
    }
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(201).send({ message: `Course is ${statusMessage}` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Fail to change the status of course",
      error,
      success: false,
    });
  }
};

export const summarizeCourseDescription = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Summarize the following Description given in 3-4 lines ignoring the html tags: ${course?.description}`
    );
    const summarizedText = result.response.text();
    return res.status(200).send({
      success: true,
      summarizedText,
      message: "Text Summarized Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Somewthing Went Wrong", error });
  }
};

export const deleteCourseController = async (req, res) => {
  // Get courseId from route parameters
  try {
    const { courseId } = req.params;
    // Find the course by ID and delete it
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res
      .status(200)
      .json({ message: "Course deleted successfully", courseId }); // Success response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getArticlesByCategory = async (req, res) => {
  try {
    const articleId = req.params.courseId;

    // Step 1: Fetch the article to get the categoryId
    const article = await Course.findById(articleId).select("category");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const categoryId = article.category;

    // Step 2: Fetch articles in the same category
    const similarArticles = await Course.find({ category: categoryId })
      .populate("category", "name")
      .populate("creator", "name photoUrl");

    if (similarArticles.length === 0) {
      return res.status(404).json({ message: "No similar articles found" });
    }

    // Return the similar articles
    res.status(200).json({ similarArticles });
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
