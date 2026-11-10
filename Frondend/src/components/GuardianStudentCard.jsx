import {
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaGraduationCap,
} from "react-icons/fa";

const formatDate = (date) => {
  if (!date) return "Date not available";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date not available"
    : parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
};

const GuardianStudentCard = ({
  child,
  isDark,
  isUpdating,
  mutedClass,
  surfaceClass,
  onAcknowledge,
}) => (
  <article
    className={`min-w-0 space-y-5 rounded-2xl border p-5 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl sm:p-6 ${surfaceClass}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-xl font-bold tracking-tight">{child.fullName}</h3>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          {child.studentId} · {child.className} · {child.section}
        </p>
      </div>
      <span
        className={`badge border font-bold ${
          isDark
            ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
            : "border-blue-200 bg-blue-50 text-blue-700"
        }`}
      >
        {child.term}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div
        className={`min-w-0 rounded-2xl border p-4 ${
          isDark
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p className={`text-xs font-medium ${mutedClass}`}>Term attendance</p>
        <p className="mt-2 text-2xl font-bold tracking-tight">
          {child.attendance.rate === null ? "—" : `${child.attendance.rate}%`}
        </p>
        <p className={`mt-1 text-xs leading-relaxed ${mutedClass}`}>
          {child.attendance.presentDays} present of{" "}
          {child.attendance.completedDays} completed days
        </p>
      </div>
      <div
        className={`min-w-0 rounded-2xl border p-4 ${
          isDark
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p className={`text-xs font-medium ${mutedClass}`}>
          Published term average
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight">
          {child.progress.average === null
            ? "—"
            : `${child.progress.average}%`}
        </p>
        <p className={`mt-1 text-xs leading-relaxed ${mutedClass}`}>
          {child.progress.publishedSubjectCount} published subjects
        </p>
      </div>
    </div>

    <section>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <FaCalendarAlt className="text-primary" />
        Recent attendance
      </h4>
      {child.attendance.recentDays.length ? (
        <ul className="flex flex-wrap gap-2">
          {child.attendance.recentDays.map((day) => (
            <li
              key={`${day.date}-${day.status}`}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {formatDate(day.date)} · {day.status}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-sm ${mutedClass}`}>
          No attendance has been recorded this term.
        </p>
      )}
    </section>

    <section>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <FaGraduationCap className="text-primary" />
        Published results
      </h4>
      {child.progress.publishedSubjects.length ? (
        <div className="overflow-x-auto">
          <table
            className={`table table-sm overflow-hidden rounded-xl border ${
              isDark
                ? "border-slate-700 text-slate-200"
                : "border-slate-200 text-slate-700"
            }`}
          >
            <thead
              className={
                isDark
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }
            >
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {child.progress.publishedSubjects.map((result) => (
                <tr key={result.subject}>
                  <td>{result.subject}</td>
                  <td>{result.total}%</td>
                  <td>{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={`text-sm ${mutedClass}`}>
          Term results are not published yet.
        </p>
      )}
    </section>

    <section>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <FaCalendarAlt className="text-primary" />
        Upcoming exams
      </h4>
      {child.upcomingExams.length ? (
        <ul className="space-y-2">
          {child.upcomingExams.map((exam) => (
            <li
              key={exam.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <span className="font-medium">{exam.title}</span>
              <span className={`text-sm ${mutedClass}`}>
                {formatDate(exam.startDate)}
                {exam.startDate !== exam.endDate &&
                  ` – ${formatDate(exam.endDate)}`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-sm ${mutedClass}`}>
          No upcoming exams are scheduled for this section.
        </p>
      )}
    </section>

    <section>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <FaExclamationTriangle className="text-warning" />
        Progress alerts
      </h4>
      {child.alerts.length ? (
        <ul className="space-y-2">
          {child.alerts.map((alert) => (
            <li
              key={alert.key}
              className={`rounded-xl border p-3 ${
                isDark
                  ? "border-amber-800 bg-amber-950/30"
                  : "border-amber-200 bg-amber-50/80"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className={`text-sm ${mutedClass}`}>{alert.message}</p>
                </div>
                {alert.acknowledged ? (
                  <span className="badge badge-success gap-1">
                    <FaCheck /> Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onAcknowledge(child.id, alert.key)}
                    className="btn btn-outline btn-xs"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-base-content/60">
          There are no active alerts for this term.
        </p>
      )}
    </section>
  </article>
);

export default GuardianStudentCard;
