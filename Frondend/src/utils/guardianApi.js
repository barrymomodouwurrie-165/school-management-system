import axios from "./apiClient.js";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthConfig = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in again to access the guardian portal.");
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const getPortalResponse = async (request, fallbackMessage) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage), { cause: error });
  }
};

export const getGuardianPortal = () =>
  getPortalResponse(
    axios.get(`${API_URL}/guardians/me`, getAuthConfig()),
    "Unable to retrieve your child's progress.",
  );

export const changeGuardianPassword = (passwords) =>
  getPortalResponse(
    axios.post(
      `${API_URL}/guardians/change-password`,
      passwords,
      getAuthConfig(),
    ),
    "Unable to update your password.",
  );

export const acknowledgeGuardianAlert = (studentId, alertKey) =>
  getPortalResponse(
    axios.post(
      `${API_URL}/guardians/acknowledgements`,
      { studentId, alertKey },
      getAuthConfig(),
    ),
    "Unable to acknowledge this alert.",
  );

export const contactSchool = (message) =>
  getPortalResponse(
    axios.post(`${API_URL}/guardians/contact`, message, getAuthConfig()),
    "Unable to contact the school.",
  );
