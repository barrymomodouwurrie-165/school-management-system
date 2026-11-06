import { useEffect, useMemo, useState } from "react";
import {
  createTeacherSuccessFollowUp,
  getTeacherClasses,
  getTeacherSuccessRadar,
  resolveTeacherSuccessFollowUp,
} from "../../utils/teacherApi";

const FOLLOW_UP_ACTIONS = [
  { value: "student-meeting", label: "Meet with student" },
  { value: "guardian-contact", label: "Contact guardian" },
  { value: "academic-support", label: "Arrange academic support" },
  { value: "attendance-check-in", label: "Attendance check-in" },
  { value: "other", label: "Other" },
];

const STATUS_STYLES = {
  "High priority": "badge-error",
  Monitor: "badge-warning",
  "On track": "badge-success",
  "Insufficient data": "badge-ghost",
};

const alertStyles = {
  high: "border-error/30 bg-error/5",
  medium: "border-warning/30 bg-warning/5",
};
const EMPTY_STUDENTS = [];

const StudentSuccessRadar = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [radarResult, setRadarResult] = useState({
    className: "",
    data: null,
    error: "",
  });
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [savingStudentId, setSavingStudentId] = useState("");
  const [resolvingFollowUpId, setResolvingFollowUpId] = useState("");
  const [showAll, setShowAll] = useState(false);

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
    getTeacherSuccessRadar(className)
      .then((result) => {
        if (active) {
          setRadarResult({ className, data: result, error: "" });
        }
      })
      .catch((loadError) => {
        if (active) {
          setRadarResult({
            className,
            data: null,
            error: loadError.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [className]);

  const isLoadingRadar = Boolean(className) && radarResult.className !== className;
  const radar =
    radarResult.className === className ? radarResult.data : null;
  const loadError =
    radarResult.className === className ? radarResult.error : "";
  const students = radar?.students ?? EMPTY_STUDENTS;
  const filteredStudents = useMemo(
    () =>
      showAll
        ? students
        : students.filter(
            (student) =>
              student.alerts.length > 0 ||
              student.followUps.some((followUp) => followUp.status === "Open"),
          ),
    [showAll, students],
  );
  const needsAttentionCount = students.filter(
    (student) => student.alerts.length > 0,
  ).length;
  const insufficientDataCount = students.filter(
    (student) => student.status === "Insufficient data",
  ).length;
  const openFollowUpCount = students.reduce(
    (total, student) =>
      total +
      student.followUps.filter((followUp) => followUp.status === "Open").length,
    0,
  );

  const handleFollowUpSubmit = async (event, student) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSavingStudentId(student.studentId);
    setStatus("");
    setError("");

    try {
      const savedFollowUp = await createTeacherSuccessFollowUp({
        className,
        studentId: student.studentId,
        academicYear: radar.academicYear,
        evaluationPeriod: radar.evaluationPeriod,
        action: formData.get("action"),
        details: formData.get("details"),
      });
      setRadarResult((current) => {
        if (current.className !== className || !current.data) return current;
        return {
          ...current,
          data: {
            ...current.data,
            students: current.data.students.map((entry) =>
              entry.studentId === student.studentId
                ? { ...entry, followUps: [savedFollowUp, ...entry.followUps] }
                : entry,
            ),
          },
        };
      });
      form.reset();
      setStatus(`Follow-up recorded for ${student.name}.`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingStudentId("");
    }
  };

  const handleResolve = async (studentId, followUpId) => {
    setResolvingFollowUpId(followUpId);
    setStatus("");
    setError("");
    try {
      const resolved = await resolveTeacherSuccessFollowUp(followUpId);
      setRadarResult((current) => {
        if (current.className !== className || !current.data) return current;
        return {
          ...current,
          data: {
            ...current.data,
            students: current.data.students.map((student) =>
              student.studentId === studentId
                ? {
                    ...student,
                    followUps: student.followUps.map((followUp) =>
                      followUp._id === followUpId
                        ? {
                            ...followUp,
                            status: resolved.status,
                            resolvedAt: resolved.resolvedAt,
                          }
                        : followUp,
                    ),
                  }
                : student,
            ),
          },
        };
      });
      setStatus("Follow-up marked as resolved.");
    } catch (resolveError) {
      setError(resolveError.message);
    } finally {
      setResolvingFollowUpId("");
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-4">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Student Success Radar</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Review attendance and results signals, add context from your remarks,
          and track the support you provide. Flags are prompts for teacher
          review, not diagnoses.
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
          The success radar is available to class teachers for their active
          classes.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-base-content/15 p-4">
            <label className="flex min-w-56 flex-col gap-2">
              <span className="text-sm font-medium">Class</span>
              <select
                className="select select-bordered select-sm"
                value={className}
                onChange={(event) => {
                  setClassName(event.target.value);
                  setError("");
                  setStatus("");
                  setShowAll(false);
                }}
              >
                {classes.map((classroom) => (
                  <option key={classroom._id} value={classroom.name}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
            {radar && (
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-md bg-warning/10 px-3 py-2">
                  {needsAttentionCount} need review
                </span>
                <span className="rounded-md bg-base-200 px-3 py-2">
                  {insufficientDataCount} need more data
                </span>
                <span className="rounded-md bg-primary/10 px-3 py-2">
                  {openFollowUpCount} open follow-ups
                </span>
              </div>
            )}
          </div>

          {radar && (
            <section className="mb-4 rounded-lg border border-base-content/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {radar.evaluationPeriod} · {radar.academicYear}
                  </h2>
                  <p className="text-xs text-base-content/70">
                    Compared with {radar.previousPeriod.evaluationPeriod} ·{" "}
                    {radar.previousPeriod.academicYear}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={showAll}
                    onChange={(event) => setShowAll(event.target.checked)}
                  />
                  Show all students
                </label>
              </div>
              <p className="mt-3 text-xs text-base-content/70">
                Signals require at least 5 completed attendance days or 2
                subject results. Attendance below 85%, an average below 50%, or
                a term-average drop of 10 points or more is flagged. Results
                may still be developing; review the full context before acting.
              </p>
            </section>
          )}

          {status && (
            <p role="status" className="mb-3 text-sm text-success">
              {status}
            </p>
          )}
          {(error || loadError) && (
            <p role="alert" className="alert alert-error mb-3">
              {error || loadError}
            </p>
          )}
          {isLoadingRadar ? (
            <p role="status" className="py-8 text-center">
              Reviewing attendance and term results...
            </p>
          ) : !radar ? null : filteredStudents.length === 0 ? (
            <p className="rounded-lg border border-base-content/20 p-6 text-center text-base-content/70">
              {students.length
                ? "No students currently have review signals or open follow-ups."
                : "There are no active students in this class."}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <article
                  key={student.studentId}
                  className="rounded-lg border border-base-content/15 p-4 shadow-sm"
                >
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold">{student.name}</h2>
                      <p className="text-xs text-base-content/70">
                        Student ID: {student.studentNumber}
                      </p>
                    </div>
                    <span
                      className={`badge ${STATUS_STYLES[student.status]}`}
                    >
                      {student.status}
                    </span>
                  </header>

                  <dl className="my-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-md bg-base-200/60 p-3">
                      <dt className="text-xs text-base-content/70">
                        This term average
                      </dt>
                      <dd className="font-semibold">
                        {student.currentAverage === null
                          ? "Not enough marks"
                          : `${student.currentAverage}%`}
                        <span className="ml-1 text-xs font-normal text-base-content/70">
                          ({student.currentSubjects} subjects)
                        </span>
                      </dd>
                    </div>
                    <div className="rounded-md bg-base-200/60 p-3">
                      <dt className="text-xs text-base-content/70">
                        Previous term average
                      </dt>
                      <dd className="font-semibold">
                        {student.previousAverage === null
                          ? "Not enough marks"
                          : `${student.previousAverage}%`}
                        <span className="ml-1 text-xs font-normal text-base-content/70">
                          ({student.previousSubjects} subjects)
                        </span>
                      </dd>
                    </div>
                    <div className="rounded-md bg-base-200/60 p-3">
                      <dt className="text-xs text-base-content/70">
                        Term attendance
                      </dt>
                      <dd className="font-semibold">
                        {student.attendanceRate === null
                          ? "Not enough days"
                          : `${student.attendanceRate}%`}
                        <span className="ml-1 text-xs font-normal text-base-content/70">
                          ({student.attendedDays}/{student.completedDays})
                        </span>
                      </dd>
                    </div>
                    <div className="rounded-md bg-base-200/60 p-3">
                      <dt className="text-xs text-base-content/70">
                        Teacher remark
                      </dt>
                      <dd className="break-words font-medium">
                        {student.teacherRemark || "No remark recorded"}
                      </dd>
                    </div>
                  </dl>

                  {student.alerts.length > 0 ? (
                    <section aria-label={`Review signals for ${student.name}`}>
                      <h3 className="mb-2 text-sm font-semibold">Review signals</h3>
                      <ul className="space-y-2">
                        {student.alerts.map((alert) => (
                          <li
                            key={alert.type}
                            className={`rounded-md border p-3 text-sm ${
                              alertStyles[alert.severity]
                            }`}
                          >
                            {alert.message}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : (
                    <p
                      className={`rounded-md border p-3 text-sm ${
                        student.status === "Insufficient data"
                          ? "border-base-content/15 bg-base-200/50"
                          : "border-success/20 bg-success/5"
                      }`}
                    >
                      {student.status === "Insufficient data"
                        ? "There is not enough attendance or results data to assess this student yet."
                        : "No current signals meet the review thresholds."}
                    </p>
                  )}

                  <section className="mt-4 border-t border-base-content/10 pt-4">
                    <h3 className="mb-2 text-sm font-semibold">
                      Follow-up history
                    </h3>
                    {student.followUps.length ? (
                      <ul className="space-y-2">
                        {student.followUps.map((followUp) => (
                          <li
                            key={followUp._id}
                            className="flex flex-wrap items-start justify-between gap-3 rounded-md bg-base-200/50 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {FOLLOW_UP_ACTIONS.find(
                                  (item) => item.value === followUp.action,
                                )?.label ?? "Follow-up"}
                                <span
                                  className={`ml-2 badge badge-sm ${
                                    followUp.status === "Open"
                                      ? "badge-warning"
                                      : "badge-success"
                                  }`}
                                >
                                  {followUp.status}
                                </span>
                              </p>
                              <p className="text-xs text-base-content/60">
                                {followUp.evaluationPeriod} ·{" "}
                                {followUp.academicYear}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap text-sm">
                                {followUp.details}
                              </p>
                              <time className="text-xs text-base-content/60">
                                {new Date(followUp.createdAt).toLocaleDateString()}
                              </time>
                            </div>
                            {followUp.status === "Open" && (
                              <button
                                type="button"
                                className="btn btn-outline btn-xs"
                                disabled={resolvingFollowUpId === followUp._id}
                                onClick={() =>
                                  handleResolve(
                                    student.studentId,
                                    followUp._id,
                                  )
                                }
                              >
                                {resolvingFollowUpId === followUp._id
                                  ? "Saving..."
                                  : "Mark resolved"}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-base-content/70">
                        No follow-up actions recorded yet.
                      </p>
                    )}
                  </section>

                  <form
                    className="mt-4 grid gap-3 border-t border-base-content/10 pt-4 md:grid-cols-[1fr_2fr_auto]"
                    onSubmit={(event) => handleFollowUpSubmit(event, student)}
                  >
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">Support action</span>
                      <select
                        name="action"
                        className="select select-bordered select-sm"
                        defaultValue="academic-support"
                      >
                        {FOLLOW_UP_ACTIONS.map((action) => (
                          <option key={action.value} value={action.value}>
                            {action.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">Action notes</span>
                      <input
                        name="details"
                        className="input input-bordered input-sm"
                        maxLength={1000}
                        placeholder="What support was agreed or completed?"
                        required
                      />
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm self-end"
                      disabled={savingStudentId === student.studentId}
                    >
                      {savingStudentId === student.studentId
                        ? "Saving..."
                        : "Record follow-up"}
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default StudentSuccessRadar;
