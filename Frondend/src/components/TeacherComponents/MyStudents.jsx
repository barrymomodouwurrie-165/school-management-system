import { useEffect, useState } from "react";
import { getTeacherStudents } from "../../utils/teacherApi";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTeacherStudents()
      .then((result) => {
        if (active) setStudents(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const highestCgpa = students.reduce(
    (highest, student) =>
      student.section !== "Senior" || student.cgpa === null
        ? highest
        : Math.max(highest, student.cgpa),
    -Infinity,
  );
  const lowestJuniorAggregate = students.reduce(
    (lowest, student) =>
      student.section !== "Junior" || student.aggregate === null
        ? lowest
        : Math.min(lowest, student.aggregate),
    Infinity,
  );

  return (
    <main className="mx-auto max-w-5xl p-4">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-sm text-base-content/70">
          Students in your assigned classes ranked by their section&apos;s grading
          system.
        </p>
        <p className="mt-1 text-xs text-base-content/60">
          Seniors are ranked by highest CGPA; Juniors by lowest Aggregate.
        </p>
      </header>

      {error ? (
        <p role="alert" className="alert alert-error">
          {error}
        </p>
      ) : isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading your students...
        </p>
      ) : students.length === 0 ? (
        <p className="rounded-lg border border-base-content/20 p-6 text-center text-base-content/70">
          No students were found in your assigned classes.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-base-content/20">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>CGPA / Aggregate</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const isTopSenior =
                  student.section === "Senior" &&
                  highestCgpa !== -Infinity &&
                  student.cgpa === highestCgpa;
                const isTopJunior =
                  student.section === "Junior" &&
                  lowestJuniorAggregate !== Infinity &&
                  student.aggregate === lowestJuniorAggregate;

                return (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>
                      {student.name}
                      {(isTopSenior || isTopJunior) && (
                        <span
                          className="ml-1 font-bold text-amber-500"
                          aria-label={
                            isTopJunior ? "Lowest Aggregate" : "Highest CGPA"
                          }
                          title={
                            isTopJunior ? "Lowest Aggregate" : "Highest CGPA"
                          }
                        >
                          *
                        </span>
                      )}
                    </td>
                    <td>{student.gender}</td>
                    <td>
                      {student.section === "Junior"
                        ? (student.aggregate ?? "—")
                        : (student.cgpa?.toFixed(2) ?? "—")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default MyStudents;
