import { useEffect, useState } from "react";
import { getTeacherClasses, getTeacherStudents } from "../../utils/teacherApi";

const MyStudents = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState("");
  const [studentsResult, setStudentsResult] = useState({
    className: "",
    students: [],
    error: "",
  });

  useEffect(() => {
    let active = true;
    getTeacherClasses()
      .then((result) => {
        if (!active) return;
        const classTeacherClasses = result.filter(
          (classroom) => classroom.isClassTeacher,
        );
        setClasses(classTeacherClasses);
        setClassName(classTeacherClasses[0]?.name ?? "");
      })
      .catch((loadError) => {
        if (active) setClassesError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoadingClasses(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!className) return undefined;

    let active = true;
    getTeacherStudents(className)
      .then((result) => {
        if (active) setStudentsResult({ className, students: result, error: "" });
      })
      .catch((loadError) => {
        if (active) {
          setStudentsResult({ className, students: [], error: loadError.message });
        }
      });

    return () => {
      active = false;
    };
  }, [className]);

  const isLoadingStudents =
    Boolean(className) && studentsResult.className !== className;
  const students =
    studentsResult.className === className ? studentsResult.students : [];
  const studentsError =
    studentsResult.className === className ? studentsResult.error : "";

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
          Students in the classes where you are the class teacher, ranked by
          their section&apos;s grading system.
        </p>
        <p className="mt-1 text-xs text-base-content/60">
          Seniors are ranked by highest CGPA; Juniors by lowest Aggregate.
        </p>
      </header>

      {classesError ? (
        <p role="alert" className="alert alert-error">
          {classesError}
        </p>
      ) : isLoadingClasses ? (
        <p role="status" className="py-8 text-center">
          Loading your classes...
        </p>
      ) : !classes.length ? (
        <p className="rounded-lg border border-base-content/20 p-6 text-center text-base-content/70">
          You are not assigned as the class teacher for any active class.
        </p>
      ) : (
        <>
          {classes.length > 1 ? (
            <label className="mb-4 flex max-w-sm flex-col gap-2">
              <span className="text-sm font-medium">Class</span>
              <select
                className="select select-bordered select-sm"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
              >
                {classes.map((classroom) => (
                  <option key={classroom._id} value={classroom.name}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="mb-4 text-sm font-medium">Class: {className}</p>
          )}

          {studentsError ? (
            <p role="alert" className="alert alert-error">
              {studentsError}
            </p>
          ) : isLoadingStudents ? (
            <p role="status" className="py-8 text-center">
              Loading students in {className}...
            </p>
          ) : students.length === 0 ? (
            <p className="rounded-lg border border-base-content/20 p-6 text-center text-base-content/70">
              No students were found in {className}.
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
        </>
      )}
    </main>
  );
};

export default MyStudents;
