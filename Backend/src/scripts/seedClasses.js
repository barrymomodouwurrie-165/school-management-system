import mongoose from "mongoose";
import ClassRoom from "../models/classRoom.js";
import connectDB from "../config/db.js";

const juniorPrograms = [..."ABCDEFGHIJKLM"];
const seniorPrograms = [
  "Science",
  "Arts",
  "Commerce",
  "Agric",
  "Home Economics",
];

const classrooms = [
  ...[7, 8, 9].flatMap((grade) =>
    juniorPrograms.map((program) => ({
      name: `Grade ${grade} ${program}`,
      grade,
      section: "Junior",
      program,
    })),
  ),
  ...[10, 11, 12].flatMap((grade) => [
    ...seniorPrograms.flatMap((program) =>
      [1, 2].map((stream_number) => ({
        name: `Grade ${grade} ${program} ${stream_number}`,
        grade,
        section: "Senior",
        program,
        stream_number,
      })),
    ),
    {
      name: `Grade ${grade} Technical`,
      grade,
      section: "Senior",
      program: "Technical",
    },
  ]),
];

try {
  await connectDB();
  await ClassRoom.init();

  const result = await ClassRoom.bulkWrite(
    classrooms.map((classroom) => ({
      updateOne: {
        filter: { name: classroom.name },
        update: { $setOnInsert: classroom },
        upsert: true,
      },
    })),
  );

  console.log(
    `Class roster ready: ${classrooms.length} classes, ${result.upsertedCount} newly created.`,
  );
} catch (error) {
  console.error("Class roster seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
