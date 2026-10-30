import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  createAcademicSubject,
  deleteAcademicSubject,
  getAcademicSubjects,
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

const sortSubjects = (subjects) =>
  [...subjects].sort(
    (first, second) =>
      first.section.localeCompare(second.section) ||
      first.name.localeCompare(second.name),
  );

const SubjectsContent = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState("Junior");
  const [programs, setPrograms] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadSubjects = async () => {
    setLoadError("");
    setIsLoading(true);
    try {
      const result = await getAcademicSubjects();
      setSubjects(sortSubjects(result));
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getAcademicSubjects()
      .then((result) => {
        if (active) setSubjects(sortSubjects(result));
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const availablePrograms =
    section === "Junior" ? JUNIOR_PROGRAMS : SENIOR_PROGRAMS;

  const toggleProgram = (program) => {
    setPrograms((current) =>
      current.includes(program)
        ? current.filter((item) => item !== program)
        : [...current, program],
    );
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    setOperationError("");
    setSuccess("");
    setIsAdding(true);
    try {
      const result = await createAcademicSubject({
        name: name.trim(),
        section,
        programs,
      });
      setSubjects((current) =>
        sortSubjects([
          ...current.filter((subject) => subject._id !== result.subject._id),
          result.subject,
        ]),
      );
      setName("");
      setPrograms([]);
      setSuccess(result.message);
    } catch (error) {
      setOperationError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (subject) => {
    const confirmed = window.confirm(
      `Delete ${subject.name} from the ${subject.section} curriculum? It will also be removed from staff subject assignments.`,
    );
    if (!confirmed) return;

    setOperationError("");
    setSuccess("");
    setDeletingId(subject._id);
    try {
      const result = await deleteAcademicSubject(subject._id);
      setSubjects((current) =>
        current.filter((item) => item._id !== subject._id),
      );
      setSuccess(result.message);
    } catch (error) {
      setOperationError(error.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleAdd}
        className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
      >
        <div className="mb-4">
          <h3 className="font-bold">Add a subject</h3>
          <p className="text-sm text-base-content/70">
            Choose the section and every program that teaches this subject.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Subject name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered input-sm"
              maxLength={100}
              placeholder="e.g. Computer Studies"
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Section</span>
            <select
              value={section}
              onChange={(event) => {
                setSection(event.target.value);
                setPrograms([]);
              }}
              className="select select-bordered select-sm"
            >
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-sm self-end"
            disabled={isAdding || !programs.length}
          >
            <FaPlus />
            {isAdding ? "Adding..." : "Add subject"}
          </button>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-semibold">
            Offered to programs/classes
          </legend>
          <div className="flex flex-wrap gap-2">
            {availablePrograms.map((program) => (
              <label
                key={program}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-base-300 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={programs.includes(program)}
                  onChange={() => toggleProgram(program)}
                />
                {section === "Junior" ? `Class ${program}` : program}
              </label>
            ))}
          </div>
        </fieldset>
        {operationError && (
          <p className="alert alert-error mt-4 py-2 text-sm" role="alert">
            {operationError}
          </p>
        )}
        {success && (
          <p className="alert alert-success mt-4 py-2 text-sm" role="status">
            {success}
          </p>
        )}
      </form>

      {loadError && (
        <div className="alert alert-error" role="alert">
          <span>{loadError}</span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={loadSubjects}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="py-8 text-center">Loading subjects...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {["Junior", "Senior"].map((currentSection) => {
            const sectionSubjects = subjects.filter(
              (subject) => subject.section === currentSection,
            );
            return (
              <section
                key={currentSection}
                className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
              >
                <header className="mb-4 border-b border-base-300 pb-3">
                  <h3 className="text-lg font-bold">
                    {currentSection} Section
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {currentSection === "Junior"
                      ? "Grades 7-9, classes A-M"
                      : "Grades 10-12, organized by stream"}
                  </p>
                </header>
                {!sectionSubjects.length ? (
                  <p className="text-sm text-base-content/60">
                    No subjects in this section yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sectionSubjects.map((subject) => (
                      <article
                        key={subject._id}
                        className="flex items-start justify-between gap-3 rounded-md border border-base-300 p-3"
                      >
                        <div>
                          <h4 className="font-semibold">{subject.name}</h4>
                          <p className="mt-1 text-xs text-base-content/70">
                            {subject.programs
                              .map((program) =>
                                currentSection === "Junior"
                                  ? `Class ${program}`
                                  : program,
                              )
                              .join(", ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDelete(subject)}
                          disabled={deletingId === subject._id}
                          aria-label={`Delete ${subject.name}`}
                          title="Delete subject"
                        >
                          <FaTrash />
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectsContent;
