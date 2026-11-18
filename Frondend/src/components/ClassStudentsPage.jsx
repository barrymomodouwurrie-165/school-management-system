import { useEffect, useMemo, useState } from "react";
import { getAdminStudents } from "../utils/adminApi";

const ClassStudentsPage = ({ classroom, onBack, onRenewStudentPassword }) => {
  const [students, setStudents] = useState([]);
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

  const classStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.class === classroom?.name && student.status !== "Transferred",
      ),
    [students, classroom],
  );

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            {classroom?.name || "Class students"}
          </h1>
          <p className="text-sm text-base-content/70">
            Students enrolled in this class
          </p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
          Back to Academics
        </button>
      </header>

      {error ? (
        <p role="alert" className="py-6 text-center text-error">
          {error}
        </p>
      ) : isLoading ? (
        <p role="status" className="py-6 text-center">
          Loading students...
        </p>
      ) : classStudents.length ? (
        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.student_id}</td>
                  <td>{`${student.first_name} ${student.last_name}`}</td>
                  <td>{student.gender}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => onRenewStudentPassword(student)}
                    >
                      Renew password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          No students are currently enrolled in this class.
        </p>
      )}
    </main>
  );
};

export default ClassStudentsPage;
