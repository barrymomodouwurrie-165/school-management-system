import mongoose from "mongoose";

const schoolCalendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    type: {
      type: String,
      enum: ["term-date", "school-event"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true },
);

schoolCalendarEventSchema.index({ startDate: 1, endDate: 1 });

const SchoolCalendarEvent = mongoose.model(
  "SchoolCalendarEvent",
  schoolCalendarEventSchema,
);

export default SchoolCalendarEvent;
