import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Course } from "../models/course.js";
import { ReadingHistory } from "../models/readingHistory.js";
// Register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, answer } = req.body;
    if (!name || !email || !password || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      answer,
    });
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

//Login
export const loginContoller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

//Logout
export const logoutController = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Log out",
    });
  }
};

//Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

//Update User Controller
export const updateUserController = async (req, res) => {
  try {
    const userId = req.id;
    const { name, about } = req.body;
    const profilePhoto = req.files?.profilePhoto?.[0];
    const bannerPhoto = req.files?.bannerPhoto?.[0];

    if (!name || !profilePhoto || !about || !bannerPhoto) {
      return res.status(500).send({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // If an image already exists, extract publicId of old image from the URL
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }
    if (user.bannerUrl) {
      const publicId = user.bannerUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }

    // Upload new photos
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const bannerResponse = await uploadMedia(bannerPhoto.path);
    const bannerUrl = bannerResponse.secure_url;

    const updatedData = { name, about, photoUrl, bannerUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).send({
      message: "User Updated Successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Update User Profile",
    });
  }
};

//Forgot Password
export const forgotController = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }
    if (!newpassword) {
      return res.status(400).send({ message: "new password is required" });
    }

    const user = await User.findOne({ email, answer });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "user not found",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newpassword, salt);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).send({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Something went Wrong",
        error,
      });
  }
};

export const addBookmark = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course is already bookmarked
    if (user.bookmarks.includes(courseId)) {
      return res.status(400).json({ message: "Course already bookmarked" });
    }

    // Add the course to bookmarks
    user.bookmarks.push(courseId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Course bookmarked successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Remove a course from user's bookmarks
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course is bookmarked
    if (!user.bookmarks.includes(courseId)) {
      return res.status(400).json({ message: "Course not bookmarked" });
    }

    // Remove the course from bookmarks
    user.bookmarks.pull(courseId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Course removed from bookmarks successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all bookmarks of the user
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.id;

    // Find the user
    const user = await User.findById(userId).populate("bookmarks"); // Populate to get course details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the bookmarks
    return res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const readingHistoryController = async (req, res) => {
  try {
    const { userId, articleId } = req.body;
    // Check if the article is already in the reading history
    const existingEntry = await ReadingHistory.findOne({ userId, articleId });

    if (existingEntry) {
      return res
        .status(200)
        .json({ message: "Article already marked as read." });
    }

    // Create a new entry in the reading history
    const readingHistoryEntry = new ReadingHistory({ userId, articleId });
    await readingHistoryEntry.save();

    return res.status(201).json({
      message: "Article marked as read and added to reading history.",
      readingHistoryEntry,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error marking article as read." });
  }
};

export const getUserReadingHistoryController = async (req, res) => {
  try {
    const userId = req.id;

    const userHistory = await ReadingHistory.find({ userId }).populate({
      path: "articleId",
      select: "articleTitle subTitle description articleThumbnail creator",
      populate: {
        path: "creator",
        select: "name photoUrl",
      },
    });

    return res.status(201).send({ userHistory });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error Fetching user Reading History." });
  }
};
