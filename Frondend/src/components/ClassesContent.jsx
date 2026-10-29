import { useEffect, useState } from "react";
import {
  createAcademicClass,
  getAcademicClasses,
} from "../utils/adminApi";

const JUNIOR_PROGRAMS = [..."ABCDEFGHIJKLM"];
const SENIOR_PROGRAMS = [
  "Science",
  "Arts",
  "Commerce",
  "Agric",
  "Home Economics",
  "Technical",
];

const ClassesContent = ({ addButton, setAddButton }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [section, setSection] = useState("Junior");
  const [grade, setGrade] = useState("");
  const [program, setProgram] = useState("");
  const [streamNumber, setStreamNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    getAcademicClasses()
      .then((result) => {
        if (active) setClassrooms(result);
      })
      .catch((error) => {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Unable to load classes.",
          });
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const grades = section === "Junior" ? [7, 8, 9] : [10, 11, 12];
  const programs = section === "Junior" ? JUNIOR_PROGRAMS : SENIOR_PROGRAMS;
  const hasStream = section === "Senior" && program !== "Technical";

  const handleSectionChange = (event) => {
    const nextSection = event.target.value;
    setSection(nextSection);
    setGrade("");
    setProgram("");
    setStreamNumber("");
  };

  const handleCreateClass = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await createAcademicClass({
        grade,
        section,
        program,
        stream_number: hasStream ? streamNumber : "",
      });
      setClassrooms((current) =>
        [...current, result.classroom].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        ),
      );
      setStatus({ type: "success", message: result.message });
      setGrade("");
      setProgram("");
      setStreamNumber("");
      setAddButton("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to create the class.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`mb-4 text-sm ${
            status.type === "error" ? "text-error" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      {addButton === "addClass" ? (
        <form
          onSubmit={handleCreateClass}
          className="space-y-3 rounded-md p-4 shadow-md"
        >
          <h3 className="font-bold">Create classroom</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="form-control">
              <span className="label-text mb-1">Section</span>
              <select
                className="select select-bordered select-sm"
                value={section}
                onChange={handleSectionChange}
                required
              >
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Grade</span>
              <select
                className="select select-bordered select-sm"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select grade
                </option>
                {grades.map((item) => (
                  <option key={item} value={item}>
                    Grade {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Program / class letter</span>
              <select
                className="select select-bordered select-sm"
                value={program}
                onChange={(event) => {
                  setProgram(event.target.value);
                  setStreamNumber("");
                }}
                required
              >
                <option value="" disabled>
                  Select program
                </option>
                {programs.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            {hasStream && (
              <label className="form-control">
                <span className="label-text mb-1">Stream</span>
                <select
                  className="select select-bordered select-sm"
                  value={streamNumber}
                  onChange={(event) => setStreamNumber(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select stream
                  </option>
                  <option value="1">Stream 1</option>
                  <option value="2">Stream 2</option>
                </select>
              </label>
            )}
          </div>
          {grade && program && (
            <p className="text-sm text-base-content/70">
              Class name:{" "}
              <strong>
                Grade {grade} {program}
                {hasStream && streamNumber ? ` ${streamNumber}` : ""}
              </strong>
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving || (hasStream && !streamNumber)}
            >
              {isSaving ? "Creating..." : "Create class"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setAddButton("")}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading classes...
        </p>
      ) : classrooms.length ? (
        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Class teacher</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom._id}>
                  <td>{classroom.name}</td>
                  <td>{classroom.section}</td>
                  <td>
                    {classroom.class_teacher
                      ? `${classroom.class_teacher.first_name} ${classroom.class_teacher.last_name}`
                      : "Not assigned"}
                  </td>
                  <td>{classroom.totalStudents}</td>
                  <td>{classroom.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          No classes have been created yet.
        </p>
      )}
    </div>
  );
};

export default ClassesContent;
