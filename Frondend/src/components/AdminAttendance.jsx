import { useEffect, useMemo, useRef, useState } from "react";
import { getAdminAttendanceSessions } from "../utils/attendanceApi";

const getAttendanceStatus = (entry) => {
  if (entry.firstCall) return "Present";
  if (entry.secondCall) return "Late";
  return "Absent";
};

const formatPercentage = (percentage) => `${percentage.toFixed(1)}%`;

const GenderAnalysis = ({ label, analysis }) => (
  <div className="rounded-lg border border-slate-200 p-4">
    <h4 className="mb-3 font-semibold">
      {label} students <span className="text-slate-500">({analysis.total})</span>
    </h4>
    <div className="grid grid-cols-3 gap-2 text-sm">
      {["present", "late", "absent"].map((status) => (
        <div key={status} className="rounded-md bg-slate-50 p-2">
          <p className="capitalize text-slate-500">{status}</p>
          <p className="font-semibold">
            {analysis[status].count} ({formatPercentage(analysis[status].percentage)})
          </p>
        </div>
      ))}
    </div>
  </div>
);

const AdminAttendance = ({ isOpen }) => {
  const [sessions, setSessions] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const previousSessions = useRef(null);

  useEffect(() => {
    let active = true;
    let refreshTimer;

    const refreshAttendance = async () => {
      try {
        const result = await getAdminAttendanceSessions();
        if (!active) return;

        const previousById = previousSessions.current;
        if (previousById) {
          const newlyCompleted = result.sessions.filter(
            (session) =>
              session.secondCallSavedAt &&
              !previousById.get(session._id)?.secondCallSavedAt,
          );
          if (newlyCompleted.length) {
            setNotifications((current) => [
              ...newlyCompleted.map((session) => ({
                id: session._id,
                className: session.className,
                date: String(session.date).slice(0, 10),
              })),
              ...current.filter(
                (notification) =>
                  !newlyCompleted.some(
                    (session) => session._id === notification.id,
                  ),
              ),
            ]);
          }
        }

        previousSessions.current = new Map(
          result.sessions.map((session) => [session._id, session]),
        );
        setSessions(result.sessions);
        setClassNames(result.classes);
        setSelectedClass((current) => current || result.classes[0] || "");
        setError("");
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load attendance.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
          refreshTimer = window.setTimeout(refreshAttendance, 10000);
        }
      }
    };

    refreshAttendance();

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
    };
  }, []);

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const sessionDate = String(session.date).slice(0, 10);
        return (
          session.className === selectedClass &&
          (!dateFilter || sessionDate === dateFilter)
        );
      }),
    [sessions, selectedClass, dateFilter],
  );

  return (
    <main className={`${isOpen ? "" : "pt-[82px]"} px-4 py-6`}>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold">CLASS ATTENDANCE</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Select one class to review its saved attendance and analysis. New
          completed sessions are checked automatically every 10 seconds.
        </p>

        <div className="my-5 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Class</span>
            <select
              className="select select-bordered select-sm min-w-48"
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                setDateFilter("");
              }}
              disabled={!classNames.length}
            >
              <option value="" disabled>
                {classNames.length ? "Select a class" : "No classes available"}
              </option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Date</span>
            <input
              type="date"
              className="input input-bordered input-sm"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </label>
          <p className="text-sm text-base-content/70">
            {filteredSessions.length} saved{" "}
            {filteredSessions.length === 1 ? "session" : "sessions"}
            {selectedClass ? ` for ${selectedClass}` : ""}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="mb-4 space-y-2" aria-live="polite">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="alert alert-success flex flex-wrap justify-between gap-2"
                role="status"
              >
                <span>
                  Attendance for <strong>{notification.className}</strong> on{" "}
                  {notification.date} is complete.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setSelectedClass(notification.className);
                      setDateFilter("");
                    }}
                  >
                    View class
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={`Dismiss notification for ${notification.className}`}
                    onClick={() =>
                      setNotifications((current) =>
                        current.filter((item) => item.id !== notification.id),
                      )
                    }
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="mb-4 text-sm text-error">
            {error}
          </p>
        )}

        {isLoading ? (
          <p role="status" className="py-8 text-center">
            Loading attendance records...
          </p>
        ) : filteredSessions.length === 0 ? (
          <p className="rounded-lg bg-white p-8 text-center text-base-content/70 shadow-sm">
            {selectedClass
              ? `No attendance sessions${dateFilter ? " match the selected date" : ""} for ${selectedClass}.`
              : "Select a class to view attendance."}
          </p>
        ) : (
          <div className="space-y-5">
            {filteredSessions.map((session) => (
              <article
                key={session._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-4">
                  <div>
                    <h2 className="text-lg font-bold">{session.className}</h2>
                    <p className="text-sm text-base-content/70">
                      {new Date(session.date).toLocaleDateString()} &middot;{" "}
                      {session.academicYear}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Marked by{" "}
                      {session.markingTeacher
                        ? `${session.markingTeacher.first_name} ${session.markingTeacher.last_name}`
                        : "Unknown teacher"}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      session.secondCallSavedAt
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {session.secondCallSavedAt
                      ? "Complete"
                      : "First call only - provisional"}
                  </span>
                </header>

                <div className="overflow-x-auto p-4">
                  <table className="table table-zebra table-sm">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student</th>
                        <th>Gender</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.entries.map((entry) => (
                        <tr key={entry.studentId}>
                          <td>{entry.studentId}</td>
                          <td>{entry.studentName}</td>
                          <td>
                            {entry.studentGender ||
                              entry.student?.gender ||
                              "Not recorded"}
                          </td>
                          <td>{getAttendanceStatus(entry)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <section className="border-t border-slate-200 p-4">
                  <h3 className="mb-3 font-bold">Attendance analysis</h3>
                  <p className="mb-4 text-sm">
                    Total students in class:{" "}
                    <strong>{session.analysis.totalStudents}</strong>
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <GenderAnalysis
                      label="Male"
                      analysis={session.analysis.male}
                    />
                    <GenderAnalysis
                      label="Female"
                      analysis={session.analysis.female}
                    />
                  </div>
                  {session.analysis.unclassified > 0 && (
                    <p className="mt-3 text-xs text-base-content/70">
                      Gender not recorded for {session.analysis.unclassified}{" "}
                      {session.analysis.unclassified === 1
                        ? "student"
                        : "students"}; excluded from male and female percentages.
                    </p>
                  )}
                  {!session.secondCallSavedAt && (
                    <p className="mt-3 text-xs text-warning">
                      These figures are provisional until the second call is saved.
                    </p>
                  )}
                </section>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminAttendance;
