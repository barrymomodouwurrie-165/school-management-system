import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Subject from "../models/subject.js";
import StaffUser from "../models/staffUser.js";
import { SUBJECT_CATALOG } from "../data/subjectCatalog.js";

const LEGACY_SUBJECT_NAMES = {
  "G.Science": "General Science",
  Civic: "Civic Education",
  "S.E.S": "Social and Environmental Studies",
  "I.R.k": "I.R.K",
  Literature: "Literature in English",
  "F.Accounting": "Financial Accounting",
  "C.Accounting": "Cost Accounting",
  "Applied Electricals": "Applied Electricity",
};

try {
  await connectDB();
  await Subject.init();
  await Subject.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } },
  );

  const result = await Subject.bulkWrite(
    SUBJECT_CATALOG.map((subject) => ({
      updateOne: {
        filter: { section: subject.section, name: subject.name },
        update: {
          $set: {
            programs: subject.programs,
            programStreams: subject.programStreams ?? [],
          },
          $setOnInsert: { isActive: true },
        },
        upsert: true,
      },
    })),
  );

  const legacyNames = Object.keys(LEGACY_SUBJECT_NAMES);
  const staffWithLegacySubjects = await StaffUser.find({
    $or: [
      { subject_taught: { $in: legacyNames } },
      { assigned_subjects: { $in: legacyNames } },
    ],
  });
  for (const staff of staffWithLegacySubjects) {
    staff.subject_taught =
      LEGACY_SUBJECT_NAMES[staff.subject_taught] ?? staff.subject_taught;
    staff.assigned_subjects = (staff.assigned_subjects ?? []).map(
      (subject) => LEGACY_SUBJECT_NAMES[subject] ?? subject,
    );
    await staff.save();
  }

  await Subject.updateMany(
    { section: "Senior", name: "Applied Electricals", isActive: true },
    { $set: { isActive: false } },
  );

  console.log(
    `Subject catalog ready: ${SUBJECT_CATALOG.length} subjects, ${result.upsertedCount} newly added.`,
  );
} catch (error) {
  console.error("Subject catalog seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
