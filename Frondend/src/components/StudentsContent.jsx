import { useEffect, useMemo, useState } from "react";
import StudentData from "./StudentData";
import StudentEditForm from "./StudentEditForm";
import {
  getAdminStudents,
  provisionStudentGuardianAccess,
} from "../utils/adminApi";

const StudentsContent = ({ initialSearch = "" }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [guardianAccess, setGuardianAccess] = useState(null);
  const [provisioningStudentId, setProvisioningStudentId] = useState("");

  useEffect(() => {
    let active = true;
    getAdminStudents()
      .then((result) => {
        if (active) setStudents(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load student records.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [
        `${student.first_name ?? ""} ${student.last_name ?? ""}`,
        student.first_name,
        student.last_name,
        student.student_id,
        student.class,
        student.section,
        student.guardian_name,
        student.gender,
        student.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [students, search]);

  const studentRows = visibleStudents.map((student) => {
    const status = student.status || "Not set";
    return {
      ...student,
      id: student._id,
      student_name: `${student.first_name} ${student.last_name}`,
      dob: student.date_of_birth,
      date_enrolled: student.enrollment_date,
      guardian_tel: student.guardian_phone,
      address: student.guardian_address,
      status,
      color:
        status === "Active"
          ? "green"
          : status === "Suspended"
            ? "yellow"
            : status === "Transferred"
              ? "gray"
              : "gray",
    };
  });

  const handleProvisionGuardian = async (student) => {
    setProvisioningStudentId(student._id);
    setGuardianAccess(null);
    setError("");
    setSuccessMessage("");
    try {
      setGuardianAccess(await provisionStudentGuardianAccess(student._id));
      setSuccessMessage(
        `Guardian portal access was linked for ${student.first_name} ${student.last_name}.`,
      );
    } catch (requestError) {
      setError(
        requestError.message || "Unable to provision guardian portal access.",
      );
    } finally {
      setProvisioningStudentId("");
    }
  };

  if (editingStudent) {
    return (
      <StudentEditForm
        student={editingStudent}
        onCancel={() => setEditingStudent(null)}
        onSaved={(updatedStudent, message) => {
          setStudents((current) =>
            current.map((student) =>
              student._id === updatedStudent._id ? updatedStudent : student,
            ),
          );
          setEditingStudent(null);
          setSuccessMessage(message || "Student details updated successfully.");
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="font-sans text-lg font-bold">STUDENTS DATA</h2>
          <p className="text-base-content/70">
            {isLoading
              ? "Loading student records..."
              : `${visibleStudents.length} of ${students.length} students shown`}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-2 max-w-[500px] flex-1">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, class, student ID or guardian"
            aria-label="Search students"
            className="input input-bordered w-full rounded-lg"
          />
        </div>
        <button
          type="button"
          className="btn btn-outline rounded-lg"
          onClick={() => setSearch("")}
        >
          Show all
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      )}
      {successMessage && (
        <p role="status" className="mt-4 text-sm text-success">
          {successMessage}
        </p>
      )}
      {guardianAccess && (
        <div className="alert alert-info mt-4">
          <div>
            {guardianAccess.created ? (
              <>
                <p className="font-bold">New guardian login credentials</p>
                <p>Username: {guardianAccess.username}</p>
                <p>Password: {guardianAccess.temporaryPassword}</p>
                <p className="text-sm">
                  Share securely. The guardian must change this temporary
                  password at first sign-in.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold">Existing guardian account linked</p>
                <p>
                  Username: {guardianAccess.username}. The existing password
                  remains unchanged.
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading student records...
        </p>
      ) : studentRows.length ? (
        <div className="my-4 overflow-x-auto rounded-lg shadow-md">
          <div className="grid min-w-[790px] grid-cols-[minmax(150px,1.2fr)_minmax(110px,0.8fr)_minmax(110px,0.8fr)_minmax(170px,1.4fr)_minmax(120px,0.8fr)_minmax(130px,1fr)] gap-4 px-2 py-2 text-base text-base-content/60">
            <span>Student</span>
            <span>Class</span>
            <span>Section</span>
            <span>Guardian</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {studentRows.map((data) => (
            <StudentData
              key={data.id}
              data={data}
              onEdit={() => {
                setSuccessMessage("");
                setEditingStudent(
                  students.find((student) => student._id === data.id),
                );
              }}
              onProvisionGuardian={() =>
                handleProvisionGuardian(
                  students.find((student) => student._id === data.id),
                )
              }
              isProvisioning={provisioningStudentId === data.id}
            />
          ))}
        </div>
      ) : (
        <p className="my-4 rounded-lg p-6 text-center text-base-content/70 shadow-md">
          {students.length
            ? "No students match your search."
            : "No student records have been registered yet."}
        </p>
      )}
    </div>
  );
};

export default StudentsContent;
