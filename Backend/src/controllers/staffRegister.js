import { isAuthentic } from "../models/tokens.js";
import StaffUser from "../models/staffUser.js";
import StaffIdCounter from "../models/staffIdCounter.js";
import STAFF_STATUSES from "../data/staffStatuses.js";

const getNextStaffId = async () => {
  const year = String(new Date().getFullYear());
  const staffIdPattern = new RegExp(`^bk-${year}(\\d+)$`);
  const counter = await StaffIdCounter.findById(year).lean();

  if (!counter) {
    const existingStaff = await StaffUser.find({
      staff_id: staffIdPattern,
    })
      .select("staff_id")
      .lean();
    const highestSequence = existingStaff.reduce((highest, staff) => {
      const match = staff.staff_id.match(staffIdPattern);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);

    try {
      await StaffIdCounter.updateOne(
        { _id: year },
        { $setOnInsert: { sequence: highestSequence } },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  const updatedCounter = await StaffIdCounter.findOneAndUpdate(
    { _id: year },
    { $inc: { sequence: 1 } },
    { new: true },
  );
  if (!updatedCounter) {
    throw new Error("Unable to allocate the next staff ID.");
  }

  return `bk-${year}${String(updatedCounter.sequence).padStart(3, "0")}`;
};

const registerStaff = async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only an admin can register staff." });
  }

  const { password } = req.body;
  const username =
    typeof req.body.username === "string"
      ? req.body.username.trim().toLowerCase()
      : "";
  const staffPosition =
    typeof req.body.role === "string" ? req.body.role.trim() : "";
  const staffFields = [
    "first_name",
    "last_name",
    "gender",
    "nationality",
    "phone_number",
    "email",
    "address",
    "ethnicity",
    "marital_status",
    "qualification",
    "subject_taught",
    "department",
    "section",
    "employment_type",
    "start_date",
  ];
  const staffData = Object.fromEntries(
    staffFields.map((field) => [field, req.body[field]]),
  );
  const missingFields = staffFields.filter(
    (field) => typeof staffData[field] !== "string" || !staffData[field].trim(),
  );

  if (!username) missingFields.push("username");
  if (typeof password !== "string" || !password) missingFields.push("password");
  if (!staffPosition) missingFields.push("role");

  if (missingFields.length) {
    return res.status(400).json({
      message: "Required staff information is missing.",
      fields: missingFields,
    });
  }

  if (!STAFF_STATUSES.includes(staffPosition)) {
    return res.status(400).json({
      message: "Select a valid staff status.",
    });
  }

  try {
    const staffId = await getNextStaffId();
    const staff = await StaffUser.create({
      ...staffData,
      staff_id: staffId,
      email: staffData.email.trim().toLowerCase(),
      username,
      password,
      staff_position: staffPosition,
      role: "teacher",
    });

    return res.status(201).json({
      message: "Staff registered successfully.",
      staff: {
        id: staff._id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        staff_id: staff.staff_id,
        username: staff.username,
        email: staff.email,
        staff_position: staff.staff_position,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "The username or email is already in use, or a generated staff ID conflicted. Please retry.",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Staff registration failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to register staff right now." });
  }
};

export default registerStaff;
