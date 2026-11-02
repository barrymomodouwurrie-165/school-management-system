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

export const getStudentExams = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view scheduled exams.");
  }

  try {
    const response = await axios.get(`${API_URL}/academics/student/exams`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve scheduled exams.",
      { cause: error },
    );
  }
};

export const getStudentResultOptions = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to check your results.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/academics/results/student/options`,
      { headers: { Authorization: ["Bearer", accessToken].join(" ") } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to load result selections.",
      { cause: error },
    );
  }
};

export const getStudentResult = async (filters) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to check your results.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/academics/results/student`,
      {
        headers: { Authorization: ["Bearer", accessToken].join(" ") },
        params: filters,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve your result.",
      { cause: error },
    );
  }
};

export const getStudentCgpa = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your CGPA.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/academics/results/student/cgpa`,
      { headers: { Authorization: ["Bearer", accessToken].join(" ") } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to retrieve your CGPA.",
      { cause: error },
    );
  }
};
