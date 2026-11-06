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

export const getStudentAttendance = async (term) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your attendance.");
  }

  try {
    const response = await axios.get(`${API_URL}/attendance/student/me`, {
      headers: { Authorization: ["Bearer", accessToken].join(" ") },
      params: term ? { term } : undefined,
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

export const getStudentStudyCoachContext = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to use the study coach.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/academics/student/study-coach/context`,
      { headers: { Authorization: ["Bearer", accessToken].join(" ") } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to load your study coach subjects.",
      { cause: error },
    );
  }
};

export const askStudentStudyCoach = async (request) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to use the study coach.");
  }

  try {
    const response = await axios.post(
      `${API_URL}/academics/student/study-coach/chat`,
      request,
      { headers: { Authorization: ["Bearer", accessToken].join(" ") } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to get a response from the study coach.",
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

export const getStudentAcademicSummary = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to view your academic summary.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/academics/results/student/summary`,
      { headers: { Authorization: ["Bearer", accessToken].join(" ") } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
      "Unable to retrieve your academic summary.",
      { cause: error },
    );
  }
};
