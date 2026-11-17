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
      maxlength: 1_500_000,
    },
  },
  { timestamps: true },
);

const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

export default NewsArticle;
