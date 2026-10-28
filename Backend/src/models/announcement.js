import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    recipients: {
      type: [
        {
          type: String,
          enum: ["guardians", "staff", "students", "all"],
        },
      ],
      required: true,
      validate: {
        validator: (recipients) =>
          recipients.length > 0 &&
          (!recipients.includes("all") || recipients.length === 1),
        message: "Choose at least one recipient; 'all' cannot be combined.",
      },
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
