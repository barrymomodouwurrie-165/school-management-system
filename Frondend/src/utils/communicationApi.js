import axios from "./apiClient.js";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again before accessing communications.");
  }
  return accessToken;
};

const getAuthConfig = () => ({
  headers: { Authorization: ["Bearer", getAccessToken()].join(" ") },
});

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const getProtected = async (path, fallbackMessage) => {
  try {
    const response = await axios.get(`${API_URL}${path}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

const postProtected = async (path, payload, fallbackMessage) => {
  try {
    const response = await axios.post(
      `${API_URL}${path}`,
      payload,
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

const putProtected = async (path, payload, fallbackMessage) => {
  try {
    const response = await axios.put(
      `${API_URL}${path}`,
      payload,
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

const patchProtected = async (path, payload, fallbackMessage) => {
  try {
    const response = await axios.patch(
      `${API_URL}${path}`,
      payload,
      getAuthConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

const deleteProtected = async (path, fallbackMessage) => {
  try {
    const response = await axios.delete(`${API_URL}${path}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

export const submitCommunication = (submission) =>
  postProtected(
    "/communications/submissions",
    submission,
    "Unable to send your submission.",
  );

export const getAnnouncements = () =>
  getProtected(
    "/communications/announcements",
    "Unable to retrieve announcements.",
  );

export const createAnnouncement = (announcement) =>
  postProtected(
    "/communications/announcements",
    announcement,
    "Unable to send the announcement.",
  );

export const updateAnnouncement = (id, announcement) =>
  putProtected(
    `/communications/announcements/${encodeURIComponent(id)}`,
    announcement,
    "Unable to update the announcement.",
  );

export const deleteAnnouncement = (id) =>
  deleteProtected(
    `/communications/announcements/${encodeURIComponent(id)}`,
    "Unable to delete the announcement.",
  );

export const getPublicNews = async ({ limit } = {}) => {
  try {
    const response = await axios.get(`${API_URL}/communications/news`, {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve public news."),
      { cause: error },
    );
  }
};

export const getAdminNews = () =>
  getProtected("/communications/news/admin", "Unable to retrieve news articles.");

export const getPublicSchoolOverview = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/communications/public-overview`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve school statistics."),
      { cause: error },
    );
  }
};

export const getSchoolNotices = async () => {
  try {
    const response = await axios.get(`${API_URL}/communications/notices`);
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve school notices."),
      { cause: error },
    );
  }
};

export const createSchoolNotice = (notice) =>
  postProtected(
    "/communications/notices",
    notice,
    "Unable to publish the school notice.",
  );

export const getAdminSchoolNotices = () =>
  getProtected(
    "/communications/notices/admin",
    "Unable to retrieve school notices.",
  );

export const updateSchoolNotice = (id, notice) =>
  putProtected(
    `/communications/notices/${encodeURIComponent(id)}`,
    notice,
    "Unable to update the school notice.",
  );

export const deleteSchoolNotice = (id) =>
  deleteProtected(
    `/communications/notices/${encodeURIComponent(id)}`,
    "Unable to delete the school notice.",
  );

export const createNewsArticle = (article) =>
  postProtected(
    "/communications/news",
    article,
    "Unable to publish news.",
  );

export const updateNewsArticle = (id, article) =>
  putProtected(
    `/communications/news/${encodeURIComponent(id)}`,
    article,
    "Unable to update the news article.",
  );

export const deleteNewsArticle = (id) =>
  deleteProtected(
    `/communications/news/${encodeURIComponent(id)}`,
    "Unable to delete the news article.",
  );

export const getAdminSubmissions = () =>
  getProtected(
    "/communications/submissions",
    "Unable to retrieve submissions.",
  );

export const getAdminSubmissionAssignees = () =>
  getProtected(
    "/communications/submissions/assignees",
    "Unable to retrieve submission owners.",
  );

export const updateAdminSubmission = (type, id, updates) =>
  patchProtected(
    `/communications/submissions/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    updates,
    "Unable to update the submission workflow.",
  );
