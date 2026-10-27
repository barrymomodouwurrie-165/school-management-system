import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  date_of_birth: {
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
  ethnicity: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  previous_school: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  enrollment_date: {
    type: String,
    required: true,
  },
  guardian_name: {
    type: String,
    required: true,
  },
  guardian_phone: {
    type: String,
    required: true,
  },
  guardian_email: {
    type: String,
  },
  guardian_address: {
    type: String,
    required: true,
  },
});

const studentUser = mongoose.model("studentUser", studentSchema);

export default studentUser;
