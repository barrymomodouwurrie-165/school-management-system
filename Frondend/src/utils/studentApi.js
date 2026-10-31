import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getStudentProfile = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your student dashboard.");
  }

  try {
    const response = await axios.get(`${API_URL}/users/student/profile`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve student profile.",
      { cause: error },
    );
  }
};

export const getStudentClassmates = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your classmates.");
  }

  try {
    const response = await axios.get(`${API_URL}/users/student/classmates`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve your classmates.",
      { cause: error },
    );
  }
};

export const getStudentAttendance = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your attendance.");
  }

  try {
    const today = new Date();
    const startYear =
      today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
    const academicYear = `${startYear}/${String(startYear + 1).slice(-2)}`;
    const response = await axios.get(`${API_URL}/attendance/student/me`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
      params: { academicYear },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve your attendance.",
      { cause: error },
    );
  }
};

export const getStudentSubjects = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your class subjects.");
  }

  try {
    const response = await axios.get(`${API_URL}/users/student/subjects`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve your class subjects.",
      { cause: error },
    );
  }
};
