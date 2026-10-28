import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again before accessing submissions.");
  }
  return accessToken;
};

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export const submitCommunication = async (submission) => {
  try {
    const response = await axios.post(
      `${API_URL}/communications/submissions`,
      submission,
      {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to send your submission."),
      { cause: error },
    );
  }
};

export const getAdminSubmissions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/communications/submissions`,
      {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve submissions."),
      { cause: error },
    );
  }
};
