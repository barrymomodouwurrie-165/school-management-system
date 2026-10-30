import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      enum: ["Junior", "Senior"],
      required: true,
    },
    programs: {
      type: [String],
      required: true,
      validate: {
        validator: (programs) => programs.length > 0,
        message: "A subject must be assigned to at least one class program.",
      },
    },
    programStreams: {
      type: [
        {
          _id: false,
          program: {
            type: String,
            required: true,
          },
          streamNumbers: {
            type: [Number],
            required: true,
            validate: {
              validator: (streamNumbers) =>
                streamNumbers.length > 0 &&
                streamNumbers.every((streamNumber) => [1, 2].includes(streamNumber)),
              message: "Stream numbers must include stream 1, stream 2, or both.",
            },
          },
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

subjectSchema.index({ section: 1, name: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
