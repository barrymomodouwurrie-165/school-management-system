import { isAuthentic } from "../models/tokens.js";
import StaffUser from "../models/staffUser.js";

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
    "staff_id",
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

  if (!["Teacher", "H.O.D", "H.O.B", "Admin"].includes(staffPosition)) {
    return res.status(400).json({
      message: "Role must be Teacher, H.O.D, H.O.B, or Admin.",
    });
  }

  try {
    const staff = await StaffUser.create({
      ...staffData,
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
        message: "The staff ID, username, or email is already in use.",
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
