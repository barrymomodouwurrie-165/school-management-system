import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";
import StudentData from "./StudentData";
import { getAdminStudents } from "../utils/adminApi";

const StudentsContent = ({ isOpen, setIsOpen }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
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
      {isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading student records...
        </p>
      ) : studentRows.length ? (
        <div className="my-4 rounded-lg shadow-md">
          <div className="grid grid-cols-6 gap-4 px-2 py-2 text-xs text-base-content/60 md:gap-0 md:text-base">
            <span>Student</span>
            <span>Class</span>
            <span>Section</span>
            <span>Guardian</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {studentRows.map((data) => (
            <StudentData key={data.id} data={data} />
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
