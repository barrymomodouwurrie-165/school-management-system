import { useEffect, useState } from "react";
import { getStudentAttendance } from "../../utils/studentApi";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const statusClassNames = {
  Present: "bg-green-600/15 text-green-700",
  Late: "bg-amber-500/15 text-amber-700",
  Absent: "bg-red-600/15 text-red-700",
  Pending: "bg-base-300 text-base-content/70",
};

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentAttendance()
      .then((result) => {
        if (active) setAttendance(result);
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

  if (isLoading) {
    return (
      <p role="status" className="mx-auto max-w-4xl p-4">
        Loading your attendance...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="mx-auto max-w-4xl p-4 text-error">
        {error}
      </p>
    );
  }

  const recentDays = attendance?.recentDays ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4">
      <div className="py-4 px-2">
        <header className="mb-4">
          <h1 className="font-bold">MY ATTENDANCE</h1>
          <p className="text-sm text-base-content/70">
            Academic session: {attendance?.academicYear || "Not available"}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex flex-col rounded-md border-t-4 border-primary p-4 shadow-sm">
            <span className="text-base-content/70">Overall attendance</span>
            <span className="text-2xl font-bold">
              {attendance?.overallAttendance ?? 0}%
            </span>
          </div>
          <div className="flex flex-col rounded-md border-t-4 border-primary p-4 shadow-sm">
            <span className="text-base-content/70">
              School days tracked this academic year
            </span>
            <span className="text-2xl font-bold">
              {attendance?.classesRecorded ?? 0}
            </span>
          </div>
          <div className="flex flex-col rounded-md border-t-4 border-primary p-4 shadow-sm">
            <span className="text-base-content/70">
              Absences this academic year
            </span>
            <span className="text-2xl font-bold">
              {attendance?.absences ?? 0}
            </span>
          </div>
        </div>

        <section className="flex flex-col gap-2 py-4">
          <h2 className="font-bold text-base-content/70">Recent days</h2>
          {recentDays.length ? (
            recentDays.map((day) => (
              <div
                key={`${day.date}-${day.status}`}
                className="flex items-center justify-between gap-3 rounded-md border border-base-content/20 p-3"
              >
                <span className="font-bold">{formatDate(day.date)}</span>
                <span
                  className={`rounded-md px-2 py-1 text-sm ${
                    statusClassNames[day.status] ?? statusClassNames.Pending
                  }`}
                >
                  {day.status === "Pending" ? "Pending second call" : day.status}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-md border border-base-content/20 p-4 text-center text-base-content/70">
              No attendance has been recorded for you this academic year.
            </p>
          )}
        </section>
        <p className="text-xs text-base-content/60">
          Attendance totals include only days where the teacher completed the
          second call. The attendance records do not currently track individual
          school terms.
        </p>
      </div>
    </main>
  );
};

export default Attendance;
