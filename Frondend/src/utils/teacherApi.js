import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getTeacherProfile = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your teacher profile.");
  }

  try {
    const response = await axios.get(`${API_URL}/users/teacher/profile`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve teacher profile.",
      { cause: error },
    );
  }
};

const getTeacherConfig = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to access teacher records.");
  }
  return { headers: { Authorization: ["Bearer", accessToken].join(" ") } };
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const getTeacherClasses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/teacher/classes`,
      getTeacherConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve your assigned classes."),
      { cause: error },
    );
  }
};

export const getTeacherStudents = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/teacher/students`,
      getTeacherConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve your students."),
      { cause: error },
    );
  }
};

export const getTeacherResults = async (filters) => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/teacher/results`,
      { ...getTeacherConfig(), params: filters },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve student results."),
      { cause: error },
    );
  }
};

export const getTeacherResultEntryWindow = async (filters) => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/results/entry-window`,
      { ...getTeacherConfig(), params: filters },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve marks-entry access."),
      { cause: error },
    );
  }
};

export const saveTeacherResults = async (results) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/teacher/results`,
      results,
      getTeacherConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to save student results."),
      { cause: error },
    );
  }
};

export const getTeacherResultRemarks = async (filters) => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/teacher/result-remarks`,
      { ...getTeacherConfig(), params: filters },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve student remarks."),
      { cause: error },
    );
  }
};

export const saveTeacherResultRemarks = async (remarks) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/teacher/result-remarks`,
      remarks,
      getTeacherConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to save student remarks."),
      { cause: error },
    );
  }
};

export const getTeacherExams = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/teacher/exams`,
      getTeacherConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve scheduled exams."),
      { cause: error },
    );
  }
};
