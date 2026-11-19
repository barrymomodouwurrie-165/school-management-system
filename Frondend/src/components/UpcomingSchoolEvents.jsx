const formatDate = (value) => {
  const dateKey = String(value || "").slice(0, 10);
  const date = new Date(`${dateKey}T00:00:00`);
  if (!dateKey || Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getEventLabel = (type) =>
  ({
    "term-date": "Term date",
    "school-event": "School event",
    exam: "Exam",
  })[type] || "School event";

const UpcomingSchoolEvents = ({
  events,
  isLoading,
  error,
  emptyMessage = "No upcoming school dates or events.",
  surfaceClass = "border-base-300 bg-base-100",
  mutedClass = "text-base-content/70",
}) => (
  <section className={`rounded-xl border p-4 shadow-sm sm:p-5 ${surfaceClass}`}>
    <header className="mb-4">
      <h2 className="text-lg font-bold">School dates &amp; events</h2>
      <p className={`mt-1 text-sm ${mutedClass}`}>
        Upcoming term dates, school events, and exam schedules.
      </p>
    </header>

    {error ? (
      <p role="alert" className="text-sm text-error">
        {error}
      </p>
    ) : isLoading ? (
      <p role="status" className={`py-4 text-sm ${mutedClass}`}>
        Loading school events...
      </p>
    ) : events.length ? (
      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id || event._id}
            className="rounded-lg border border-base-300 p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="badge badge-primary badge-outline mb-1">
                  {getEventLabel(event.type)}
                </span>
                <h3 className="break-words font-semibold">{event.title}</h3>
              </div>
              <time
                className={`text-sm ${mutedClass}`}
                dateTime={String(event.startDate).slice(0, 10)}
              >
                {formatDate(event.startDate)}
                {String(event.startDate).slice(0, 10) !==
                  String(event.endDate).slice(0, 10) &&
                  ` – ${formatDate(event.endDate)}`}
              </time>
            </div>
            {event.description && (
              <p className={`mt-2 whitespace-pre-wrap text-sm ${mutedClass}`}>
                {event.description}
              </p>
            )}
            {event.section && (
              <p className={`mt-2 text-xs ${mutedClass}`}>
                {event.section} section
              </p>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className={`py-4 text-sm ${mutedClass}`}>{emptyMessage}</p>
    )}
  </section>
);

export default UpcomingSchoolEvents;
