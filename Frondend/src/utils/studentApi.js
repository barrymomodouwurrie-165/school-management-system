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
