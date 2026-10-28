import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again before accessing attendance.");
  }
  return accessToken;
};

const requestConfig = () => ({
  headers: { Authorization: `Bearer ${getAccessToken()}` },
});

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export const getTeacherAttendanceClasses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/attendance/classes`,
      requestConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve your classes."),
      { cause: error },
    );
  }
};

export const getClassAttendanceSessions = async (classId, date) => {
  try {
    const response = await axios.get(
      `${API_URL}/attendance/classes/${classId}/sessions`,
      {
        ...requestConfig(),
        params: date ? { date } : undefined,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve attendance."),
      { cause: error },
    );
  }
};

export const saveClassAttendanceCall = async (classId, attendance) => {
  try {
    const response = await axios.post(
      `${API_URL}/attendance/classes/${classId}/sessions`,
      attendance,
      requestConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to save attendance."),
      { cause: error },
    );
  }
};
