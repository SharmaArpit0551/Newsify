import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// configing the dotenv file
dotenv.config();

const app = express();

// creating the middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Connection to database
connectDB();

//ROUTES
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/comment", commentRoutes);

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = path.dirname(__filename);

// Serve static files from the assets folder
app.use(express.static(path.join(__dirname, "./client/dist")));

// Route to serve `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
