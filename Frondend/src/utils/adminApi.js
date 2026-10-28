import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAdminConfig = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in as an admin before registering users.");
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

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
