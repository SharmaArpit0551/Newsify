import mongoose from "mongoose";

const ReadingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  readAt: { type: Date, default: Date.now },
});

export const ReadingHistory = mongoose.model(
  "ReadingHistory",
  ReadingHistorySchema
);
