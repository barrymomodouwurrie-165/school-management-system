import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { getAdminSubmissions } from "../utils/communicationApi";

const FILTERS = [
  { id: "all", label: "All submissions" },
  { id: "student-report", label: "Student reports" },
  { id: "suggestion", label: "Suggestions" },
  { id: "complaint", label: "Complaints" },
];

const formatDate = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleString();
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState({ reports: [], feedback: [] });
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    try {
      setSubmissions(await getAdminSubmissions());
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to retrieve submissions.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    getAdminSubmissions()
      .then((data) => {
        if (isActive) setSubmissions(data);
      })
      .catch((error) => {
        if (isActive) {
          setStatus({
            type: "error",
            message: error.message || "Unable to retrieve submissions.",
          });
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const allSubmissions = useMemo(
    () => [
      ...submissions.reports.map((report) => ({
        ...report,
        submissionType: "student-report",
        title: `Report: ${report.reportedStudent}`,
        details: report.description,
        submittedAt: report.createdAt,
      })),
      ...submissions.feedback.map((item) => ({
        ...item,
        submissionType: item.type,
        title: item.subject,
        submittedAt: item.createdAt,
      })),
    ].sort(
      (first, second) =>
        new Date(second.submittedAt).getTime() -
        new Date(first.submittedAt).getTime(),
    ),
    [submissions],
  );

  const visibleSubmissions =
    filter === "all"
      ? allSubmissions
      : allSubmissions.filter((item) => item.submissionType === filter);

  return (
    <section className="mx-auto max-w-6xl p-4 pt-8">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Student and Staff Submissions</h1>
          <p className="mt-1 text-sm text-base-content/70">
            Review reports, suggestions, and complaints submitted to the
            administration.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSubmissions}
          disabled={isLoading}
          className="btn btn-outline btn-sm"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </header>

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Submission filters">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`btn btn-sm ${filter === item.id ? "btn-primary" : "btn-ghost"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {status.message && (
        <p
          role="alert"
          className={`mb-4 rounded-md p-3 text-sm ${
            status.type === "error" ? "bg-error/10 text-error" : ""
          }`}
        >
          {status.message}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="py-8 text-center text-base-content/70">
          Loading submissions...
        </p>
      ) : visibleSubmissions.length === 0 ? (
        <div className="rounded-lg border border-base-300 p-8 text-center text-base-content/70">
          No submissions to show.
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleSubmissions.map((item) => (
            <article
              key={`${item.submissionType}-${item._id}`}
              className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="badge badge-primary badge-outline mb-2 capitalize">
                    {item.submissionType.replace("-", " ")}
                  </span>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                </div>
                <time
                  className="text-sm text-base-content/60"
                  dateTime={item.submittedAt}
                >
                  {formatDate(item.submittedAt)}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm">{item.details}</p>

              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-base-300 pt-3 text-sm">
                <div>
                  <dt className="inline font-medium">From: </dt>
                  <dd className="inline capitalize">
                    {item.anonymous
                      ? "Anonymous"
                      : `${item.submittedByName} (${item.submittedByRole})`}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium">Category: </dt>
                  <dd className="inline capitalize">{item.category}</dd>
                </div>
                {item.urgency && (
                  <div>
                    <dt className="inline font-medium">Urgency: </dt>
                    <dd className="inline capitalize">
                      {item.urgency.replaceAll("-", " ")}
                    </dd>
                  </div>
                )}
                {item.notifyGuardian && (
                  <div>Parent/guardian notification recommended</div>
                )}
                {item.requestCounselor && <div>Counselor support requested</div>}
                {item.confidential && <div>Confidential handling requested</div>}
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminSubmissions;
