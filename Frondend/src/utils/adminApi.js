import axios from "./apiClient.js";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAdminConfig = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Please sign in as an admin to manage user records.");
  }
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export const getAdminStaff = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/staff`, getAdminConfig());
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve staff records."),
      { cause: error },
    );
  }
};

export const updateAdminStaff = async (staffId, staff) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}`,
      staff,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update staff details."),
      { cause: error },
    );
  }
};

export const getAdminStudents = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/students`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve student records."),
      { cause: error },
    );
  }
};

export const updateAdminStudent = async (studentId, student) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/students/${encodeURIComponent(studentId)}`,
      student,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update student details."),
      { cause: error },
    );
  }
};

export const getStaffAssignments = async (staffId) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}/assignments`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve staff assignments."),
      { cause: error },
    );
  }
};

export const updateStaffAssignments = async (staffId, assignments) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/staff/${encodeURIComponent(staffId)}/assignments`,
      assignments,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update staff assignments."),
      { cause: error },
    );
  }
};

export const registerStaff = async (staff) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/staff/register`,
      staff,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to register staff."),
      { cause: error },
    );
  }
};

export const registerStudent = async (student) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/students/register`,
      student,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to register student."),
      { cause: error },
    );
  }
};

export const provisionStudentGuardianAccess = async (studentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/students/${encodeURIComponent(studentId)}/guardian-access`,
      {},
      getAdminConfig(),
    );
    return response.data.guardianAccess;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to provision guardian portal access."),
      { cause: error },
    );
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/admin/profile`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve admin profile."),
      { cause: error },
    );
  }
};

export const getAdminDashboardOverview = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/admin/dashboard-overview`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve dashboard overview."),
      { cause: error },
    );
  }
};

export const updateAdminProfile = async (profile) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/admin/profile`,
      profile,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update admin profile."),
      { cause: error },
    );
  }
};

export const getAcademicClasses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/classes`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve classes."),
      { cause: error },
    );
  }
};

export const createAcademicClass = async (classroom) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/classes`,
      classroom,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to create the class."),
      { cause: error },
    );
  }
};

export const getAcademicSubjects = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/subjects`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve subjects."),
      { cause: error },
    );
  }
};

export const createAcademicSubject = async (subject) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/subjects`,
      subject,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to add the subject."),
      { cause: error },
    );
  }
};

export const deleteAcademicSubject = async (subjectId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/academics/subjects/${encodeURIComponent(subjectId)}`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to delete the subject."),
      { cause: error },
    );
  }
};

export const getAcademicExams = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/exams`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve exams."),
      { cause: error },
    );
  }
};

export const createAcademicExam = async (exam) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/exams`,
      exam,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to create the exam."),
      { cause: error },
    );
  }
};

export const getAdminResultOptions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/academics/results/admin/options`,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve result selections."),
      { cause: error },
    );
  }
};

export const getAdminResultsForPublishing = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/academics/results/admin`, {
      ...getAdminConfig(),
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve results for publishing."),
      { cause: error },
    );
  }
};

export const getAdminResultEntryWindow = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/academics/results/entry-window`, {
      ...getAdminConfig(),
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to retrieve marks-entry access."),
      { cause: error },
    );
  }
};

export const updateAdminResultEntryWindow = async (settings) => {
  try {
    const response = await axios.put(
      `${API_URL}/academics/results/entry-window`,
      settings,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update marks-entry access."),
      { cause: error },
    );
  }
};

export const publishAdminResults = async (resultSelection) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/results/admin/publish`,
      resultSelection,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to publish results."),
      { cause: error },
    );
  }
};

export const publishAllAdminResults = async (termSelection) => {
  try {
    const response = await axios.post(
      `${API_URL}/academics/results/admin/publish-all`,
      termSelection,
      getAdminConfig(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to publish all results."),
      { cause: error },
    );
  }
};
