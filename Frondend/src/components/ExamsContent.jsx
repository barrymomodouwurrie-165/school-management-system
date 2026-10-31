import { useEffect, useState } from "react";
import { createAcademicExam, getAcademicExams } from "../utils/adminApi";
import { getTeacherExams } from "../utils/teacherApi";

const formatDate = (value) => {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return "Invalid date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const ExamsContent = ({ addButton, setAddButton, readOnly = false }) => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [section, setSection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    (readOnly ? getTeacherExams() : getAcademicExams())
      .then((result) => {
        if (active) setExams(result);
      })
      .catch((error) => {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Unable to load exams.",
          });
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [readOnly]);

  const handleCreateExam = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await createAcademicExam({
        title,
        startDate,
        endDate,
        section,
      });
      setExams((current) =>
        [...current, result.exam].sort(
          (first, second) =>
            new Date(first.startDate).getTime() -
            new Date(second.startDate).getTime(),
        ),
      );
      setStatus({ type: "success", message: result.message });
      setTitle("");
      setStartDate("");
      setEndDate("");
      setSection("");
      setAddButton("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to create the exam.",
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

      {!readOnly && addButton === "addExam" ? (
        <form
          onSubmit={handleCreateExam}
          className="space-y-3 rounded-md p-4 shadow-md"
        >
          <h3 className="font-bold">Add exam</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="form-control sm:col-span-2">
              <span className="label-text mb-1">Exam title</span>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Start date</span>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">End date</span>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Section</span>
              <select
                className="select select-bordered select-sm"
                value={section}
                onChange={(event) => setSection(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select section
                </option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Both">Both</option>
              </select>
            </label>
          </div>
          <p className="text-xs text-base-content/70">
            Status is set automatically: Scheduled until the end date passes,
            then Completed.
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save exam"}
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
          Loading exams...
        </p>
      ) : exams.length ? (
        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Section</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.title}</td>
                  <td>{formatDate(exam.startDate)}</td>
                  <td>{formatDate(exam.endDate)}</td>
                  <td>{exam.section}</td>
                  <td>
                    <span
                      className={`badge ${
                        exam.status === "Completed"
                          ? "badge-error"
                          : "badge-success"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          No exams have been added yet.
        </p>
      )}
    </div>
  );
};

export default ExamsContent;
