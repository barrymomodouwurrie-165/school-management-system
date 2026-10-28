import mongoose from "mongoose";

const newsArticleSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    story: {
      type: String,
      required: true,
      trim: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

export default NewsArticle;
