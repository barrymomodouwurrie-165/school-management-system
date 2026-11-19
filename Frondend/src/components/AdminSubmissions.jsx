import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import AdminSubmissionCard from "./AdminSubmissionCard";
import {
  getAdminSubmissionAssignees,
  getAdminSubmissions,
  updateAdminSubmission,
} from "../utils/communicationApi";

const FILTERS = [
  { id: "all", label: "All submissions" },
  { id: "student-report", label: "Student reports" },
  { id: "suggestion", label: "Suggestions" },
  { id: "complaint", label: "Complaints" },
];

const STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "open", label: "Open" },
  { id: "in-progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState({ reports: [], feedback: [] });
  const [assignees, setAssignees] = useState([]);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = useCallback(
    () => Promise.all([getAdminSubmissions(), getAdminSubmissionAssignees()]),
    [],
  );

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const [data, owners] = await fetchAdminData();
      setSubmissions(data);
      setAssignees(owners);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to retrieve submissions.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAdminData]);

  useEffect(() => {
    let isActive = true;

    fetchAdminData()
      .then(([data, owners]) => {
        if (!isActive) return;
        setSubmissions(data);
        setAssignees(owners);
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
  }, [fetchAdminData]);

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
        details: item.details,
        submittedAt: item.createdAt,
      })),
    ].sort(
      (first, second) =>
        new Date(second.submittedAt).getTime() -
        new Date(first.submittedAt).getTime(),
    ),
    [submissions],
  );

  const visibleSubmissions = allSubmissions.filter(
    (item) =>
      (filter === "all" || item.submissionType === filter) &&
      (statusFilter === "all" || (item.status || "open") === statusFilter),
  );

  const handleSaveWorkflow = async (item, updates) => {
    const result = await updateAdminSubmission(
      item.submissionType,
      item._id,
      updates,
    );
    setSubmissions((current) => {
      const collection =
        item.submissionType === "student-report" ? "reports" : "feedback";
      return {
        ...current,
        [collection]: current[collection].map((submission) =>
          submission._id === item._id ? result.submission : submission,
        ),
      };
    });
    setStatus({ type: "success", message: result.message });
  };

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

      <label className="mb-4 flex max-w-xs flex-col gap-1">
        <span className="text-sm font-medium">Filter by status</span>
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          {STATUS_FILTERS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`mb-4 rounded-md p-3 text-sm ${
            status.type === "error"
              ? "bg-error/10 text-error"
              : "bg-success/10 text-success"
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
          No submissions match these filters.
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleSubmissions.map((item) => (
            <AdminSubmissionCard
              key={`${item.submissionType}-${item._id}-${item.updatedAt || item.createdAt}`}
              item={item}
              assignees={assignees}
              onSave={handleSaveWorkflow}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminSubmissions;
