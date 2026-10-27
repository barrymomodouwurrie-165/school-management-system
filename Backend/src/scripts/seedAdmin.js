import mongoose from "mongoose";
import AdminUser from "../models/adminUser.js";
import connectDB from "../config/db.js";

const username = (
  process.env.ADMIN_USERNAME ??
  process.env.ADMIN_username ??
  process.env.ADMIN_EMAIL
)
  ?.trim()
  .toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error(
    "Set ADMIN_USERNAME (or ADMIN_EMAIL) and ADMIN_PASSWORD before seeding the admin account.",
  );
  process.exit(1);
}

try {
  await connectDB();

  const admin = await AdminUser.findOne({ username });
  if (admin) {
    admin.password = password;
    await admin.save();
  } else {
    await AdminUser.create({ username, password });
  }

  console.log(`Admin account ${username} created or updated.`);
} catch (error) {
  console.error("Admin account seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
