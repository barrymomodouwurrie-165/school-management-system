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

export const getPublicNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/communications/news`);
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve public news."),
      { cause: error },
    );
  }
};

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

export const createNewsArticle = (article) =>
  postProtected(
    "/communications/news",
    article,
    "Unable to publish news.",
  );

export const getAdminSubmissions = () =>
  getProtected(
    "/communications/submissions",
    "Unable to retrieve submissions.",
  );
