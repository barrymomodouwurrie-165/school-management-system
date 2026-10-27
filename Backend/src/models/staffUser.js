import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ethnicity: {
    type: String,
    required: true,
  },
  marital_status: {
    type: String,
    required: true,
  },
  staff_id: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  subject_taught: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  employment_type: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const StaffUser = mongoose.model("StaffUser", staffSchema);

export default StaffUser;
