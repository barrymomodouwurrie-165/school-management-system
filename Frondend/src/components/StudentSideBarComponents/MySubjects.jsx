import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { getStudentSubjects } from "../../utils/studentApi";

const MySubjects = () => {
  const [classSubjects, setClassSubjects] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentSubjects()
      .then((result) => {
        if (active) setClassSubjects(result);
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

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-5">
        <h1 className="text-lg font-bold">MY SUBJECTS</h1>
        <p className="text-sm text-base-content/70">
          Subjects offered in{" "}
          {classSubjects?.className || "your current class"}.
        </p>
      </header>

      {isLoading ? (
        <p role="status" className="rounded-md p-6 text-center shadow-md">
          Loading your subjects...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-md p-6 text-center text-error shadow-md">
          {error}
        </p>
      ) : classSubjects?.subjects.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classSubjects.subjects.map((subject) => (
            <li
              key={subject.id}
              className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FaBook aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{subject.name}</span>
                <span className="mt-1 block text-sm text-base-content/70">
                  Teacher{subject.teachers.length === 1 ? "" : "s"}:{" "}
                  {subject.teachers.length
                    ? subject.teachers.join(", ")
                    : "Not assigned"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          No active subjects are currently listed for this class.
        </p>
      )}
    </main>
  );
};

export default MySubjects;
