import { useEffect, useMemo, useState } from "react";
import {
  getTeacherClasses,
  getTeacherResultRemarks,
  saveTeacherResultRemarks,
} from "../../utils/teacherApi";

const getCurrentAcademicYear = () => {
  const today = new Date();
  const startYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  return `${startYear}/${startYear + 1}`;
};

const TeacherRemarks = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [evaluationPeriod, setEvaluationPeriod] = useState("First Term");
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear);
  const [remarkResult, setRemarkResult] = useState({
    key: "",
    remarks: {},
    error: "",
  });
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [classesError, setClassesError] = useState("");

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
      .catch((error) => {
        if (active) setClassesError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingClasses(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedClass = useMemo(
    () => classes.find((classroom) => classroom.name === className),
    [classes, className],
  );
  const students = selectedClass?.students ?? [];
  const remarksKey = selectedClass
    ? JSON.stringify([className, academicYear, evaluationPeriod])
    : "";
  const isLoadingRemarks = Boolean(
    remarksKey && remarkResult.key !== remarksKey,
  );
  const currentRemarkResult =
    remarkResult.key === remarksKey ? remarkResult : null;

  useEffect(() => {
    if (!remarksKey) return undefined;

    let active = true;
    getTeacherResultRemarks({ className, academicYear, evaluationPeriod })
      .then((savedRemarks) => {
        if (!active) return;
        setRemarkResult({
          key: remarksKey,
          remarks: Object.fromEntries(
            savedRemarks.map((entry) => [entry.studentId, entry.remark]),
          ),
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setRemarkResult({ key: remarksKey, remarks: {}, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [academicYear, className, evaluationPeriod, remarksKey]);

  const handleRemarkChange = (studentId, value) => {
    setRemarkResult((current) => ({
      ...current,
      remarks: { ...current.remarks, [studentId]: value },
    }));
    setStatus({ type: "", message: "" });
  };

  const handleSave = async () => {
    setStatus({ type: "", message: "" });
    setIsSaving(true);
    try {
      const result = await saveTeacherResultRemarks({
        className,
        academicYear,
        evaluationPeriod,
        entries: students.map((student) => ({
          studentId: student.id,
          remark: remarkResult.remarks[student.id] ?? "",
        })),
      });
      setStatus({ type: "success", message: result.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-4 rounded-md px-3 py-4 shadow-md">
        <h1 className="text-xl font-bold text-blue-600">Teacher&apos;s Remarks</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Class teachers can add an optional remark for each student. Leave a
          remark blank to use the automated remark on the result.
        </p>
      </header>

      {classesError && (
        <p role="alert" className="mb-3 text-sm text-error">
          {classesError}
        </p>
      )}
      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`mb-3 text-sm ${
            status.type === "error" ? "text-error" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      {isLoadingClasses ? (
        <p role="status" className="py-8 text-center">
          Loading your classes...
        </p>
      ) : !classes.length ? (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          You are not assigned as a class teacher for any active class.
        </p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 rounded-md px-3 py-4 shadow-md sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-base-content/70">CLASS</span>
              <select
                className="select select-ghost select-sm rounded-md bg-blue-600/5"
                value={className}
                onChange={(event) => {
                  setClassName(event.target.value);
                  setStatus({ type: "", message: "" });
                }}
              >
                {classes.map((classroom) => (
                  <option key={classroom._id} value={classroom.name}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-base-content/70">
                EVALUATION PERIOD
              </span>
              <select
                className="select select-ghost select-sm rounded-md bg-blue-600/5"
                value={evaluationPeriod}
                onChange={(event) => {
                  setEvaluationPeriod(event.target.value);
                  setStatus({ type: "", message: "" });
                }}
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-base-content/70">ACADEMIC YEAR</span>
              <input
                className="input input-ghost input-sm bg-blue-600/5"
                value={academicYear}
                onChange={(event) => {
                  setAcademicYear(event.target.value);
                  setStatus({ type: "", message: "" });
                }}
                pattern="\d{4}/\d{4}"
                title="Use the format YYYY/YYYY"
                required
              />
            </label>
          </div>

          {isLoadingRemarks ? (
            <p role="status" className="py-8 text-center">
              Loading student remarks...
            </p>
          ) : currentRemarkResult?.error ? (
            <p role="alert" className="py-4 text-sm text-error">
              {currentRemarkResult.error}
            </p>
          ) : students.length ? (
            <>
              <div className="space-y-3 rounded-md p-3 shadow-md">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="grid gap-1 border-b border-base-300 pb-3 last:border-0 sm:grid-cols-[minmax(10rem,1fr)_2fr]"
                  >
                    <span className="text-sm font-medium">
                      {student.name}
                      <span className="ml-2 text-xs text-base-content/60">
                        {student.studentId}
                      </span>
                    </span>
                    <textarea
                      aria-label={`Teacher's remark for ${student.name}`}
                      className="textarea textarea-bordered textarea-sm w-full"
                      value={remarkResult.remarks[student.id] ?? ""}
                      onChange={(event) =>
                        handleRemarkChange(student.id, event.target.value)
                      }
                      maxLength={250}
                      rows={2}
                      disabled={isSaving}
                      placeholder="Optional remark (up to 250 characters)"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-sm rounded-md"
                  onClick={handleSave}
                  disabled={isSaving || isLoadingRemarks}
                >
                  {isSaving ? "Saving remarks..." : "Save Remarks"}
                </button>
                <span className="text-xs text-base-content/70">
                  Maximum 250 characters per student.
                </span>
              </div>
            </>
          ) : (
            <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
              There are no active students in this class.
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default TeacherRemarks;
