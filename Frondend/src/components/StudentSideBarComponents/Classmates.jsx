import { useEffect, useMemo, useState } from "react";
import { getStudentClassmates } from "../../utils/studentApi";
import StudentsData from "./StudentsData";

const Classmates = () => {
  const [classmates, setClassmates] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentClassmates()
      .then((result) => {
        if (active) setClassmates(result);
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

  const filteredClassmates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return classmates;
    return classmates.filter(
      (classmate) =>
        classmate.name.toLowerCase().includes(query) ||
        classmate.studentId.toLowerCase().includes(query),
    );
  }, [classmates, search]);

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-4">
        <h1 className="text-lg font-bold">CLASSMATES</h1>
        <p className="text-sm text-base-content/70">
          Students currently in your class.
        </p>
      </header>

      <label className="form-control mb-4">
        <span className="sr-only">Search classmates</span>
        <input
          type="search"
          placeholder="Search by name or student ID"
          className="input input-bordered w-full rounded-md"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {isLoading ? (
        <p role="status" className="rounded-md p-6 text-center shadow-md">
          Loading classmates...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-md p-6 text-center text-error shadow-md">
          {error}
        </p>
      ) : filteredClassmates.length ? (
        <div className="rounded-md px-4 shadow-md">
          {filteredClassmates.map((student) => (
            <StudentsData key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          {search.trim()
            ? "No classmates match your search."
            : "No other active students are currently listed in your class."}
        </p>
      )}
    </main>
  );
};

export default Classmates;
