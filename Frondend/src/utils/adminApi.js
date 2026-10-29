import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAdminConfig = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in as an admin to manage user records.");
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export const getAdminStaff = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/staff`, getAdminConfig());
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve staff records."),
      { cause: error },
    );
  }
};

export const updateAdminStaff = async (staffId, staff) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}`,
      staff,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update staff details."),
      { cause: error },
    );
  }
};

export const getAdminStudents = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/students`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve student records."),
      { cause: error },
    );
  }
};

export const updateAdminStudent = async (studentId, student) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/students/${encodeURIComponent(studentId)}`,
      student,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update student details."),
      { cause: error },
    );
  }
};

export const getStaffAssignments = async (staffId) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}/assignments`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve staff assignments."),
      { cause: error },
    );
  }
};

export const updateStaffAssignments = async (staffId, assignments) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}/assignments`,
      assignments,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update staff assignments."),
      { cause: error },
    );
  }
};

export const registerStaff = async (staff) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/staff/register`,
      staff,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to register staff."),
      { cause: error },
    );
  }
};

export const registerStudent = async (student) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/students/register`,
      student,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to register student."),
      { cause: error },
    );
  }
};
