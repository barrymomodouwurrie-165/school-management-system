import { useEffect, useState } from "react";
import { getTeacherClassSubjects } from "../../utils/teacherApi";

const MyClassSubjects = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTeacherClassSubjects()
      .then((result) => {
        if (active) setClasses(result);
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
    <main className="mx-auto max-w-5xl p-4">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">My Class Subjects</h1>
        <p className="text-sm text-base-content/70">
          Subjects taught in your assigned classes and the teachers responsible
          for each subject.
        </p>
      </header>

      {error ? (
        <p role="alert" className="alert alert-error">
          {error}
        </p>
      ) : isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading your class subjects...
        </p>
      ) : classes.length === 0 ? (
        <p className="rounded-lg border border-base-content/20 p-6 text-center text-base-content/70">
          No active assigned classes were found.
        </p>
      ) : (
        <div className="space-y-6">
          {classes.map((classroom) => (
            <section
              key={classroom.name}
              className="overflow-hidden rounded-lg border border-base-content/20"
            >
              <h2 className="bg-blue-600/10 px-4 py-3 text-lg font-semibold">
                {classroom.name}
              </h2>
              {classroom.subjects.length === 0 ? (
                <p className="p-4 text-sm text-base-content/70">
                  No subjects are currently assigned to teachers for this class.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Telephone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classroom.subjects.map((subject) =>
                        subject.teachers.length ? (
                          subject.teachers.map((teacher, index) => (
                            <tr key={`${subject.name}-${teacher.id}`}>
                              {index === 0 && (
                                <td rowSpan={subject.teachers.length}>
                                  {subject.name}
                                </td>
                              )}
                              <td>{teacher.name}</td>
                              <td>{teacher.phoneNumber}</td>
                            </tr>
                          ))
                        ) : null,
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyClassSubjects;
