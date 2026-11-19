import { useState } from "react";

const WORKFLOW_STATUSES = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
};

const getStatusLabel = (status) =>
  WORKFLOW_STATUSES.find((item) => item.value === status)?.label || "Open";

const AdminSubmissionCard = ({ item, assignees, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState(item.status || "open");
  const [assignedToId, setAssignedToId] = useState(
    item.assignedTo?.userId || "",
  );
  const [internalNote, setInternalNote] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const updates = {};
    if (selectedStatus !== (item.status || "open")) {
      updates.status = selectedStatus;
      if (selectedStatus === "resolved") {
        if (!resolutionNote.trim()) {
          setError("Add a resolution summary before resolving this submission.");
          return;
        }
        updates.resolutionNote = resolutionNote.trim();
      }
    }

    if (assignedToId !== (item.assignedTo?.userId || "")) {
      updates.assignedToId = assignedToId || null;
    }
    if (internalNote.trim()) updates.internalNote = internalNote.trim();
    if (!Object.keys(updates).length) {
      setError("Make a workflow change or add an internal note before saving.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(item, updates);
      setInternalNote("");
      setResolutionNote("");
    } catch (saveError) {
      setError(saveError.message || "Unable to update this submission.");
    } finally {
      setIsSaving(false);
    }
  };

  const statusClass =
    item.status === "resolved"
      ? "badge-success"
      : item.status === "in-progress"
        ? "badge-warning"
        : "badge-info";

  return (
    <article className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="badge badge-primary badge-outline capitalize">
              {item.submissionType.replace("-", " ")}
            </span>
            <span className={`badge ${statusClass}`}>
              {getStatusLabel(item.status || "open")}
            </span>
            {item.confidential && (
              <span className="badge badge-error badge-outline">
                Confidential
              </span>
            )}
            {item.urgency && item.urgency !== "standard" && (
              <span
                className={`badge ${
                  item.urgency === "very-urgent" ? "badge-error" : "badge-warning"
                }`}
              >
                {item.urgency.replaceAll("-", " ")}
              </span>
            )}
          </div>
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
        {item.notifyGuardian && (
          <div>Parent/guardian notification recommended</div>
        )}
        {item.requestCounselor && <div>Counselor support requested</div>}
      </dl>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-4 border-t border-base-300 pt-4 lg:grid-cols-2"
      >
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Status</span>
          <select
            className="select select-bordered"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            {WORKFLOW_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Owner (admin)</span>
          <select
            className="select select-bordered"
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
          >
            <option value="">Unassigned</option>
            {assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
        </label>

        {selectedStatus === "resolved" &&
          selectedStatus !== (item.status || "open") && (
            <label className="form-control lg:col-span-2">
              <span className="label-text mb-1 font-semibold">
                Resolution summary (required)
              </span>
              <textarea
                className="textarea textarea-bordered min-h-20"
                maxLength={3000}
                value={resolutionNote}
                onChange={(event) => setResolutionNote(event.target.value)}
                placeholder="Record the outcome or action taken."
                required
              />
            </label>
          )}

        <label className="form-control lg:col-span-2">
          <span className="label-text mb-1 font-semibold">Add internal note</span>
          <span className="mb-2 text-xs text-base-content/60">
            Admin-only. These notes are not shown to the person who submitted
            this item.
          </span>
          <textarea
            className="textarea textarea-bordered min-h-20"
            maxLength={3000}
            value={internalNote}
            onChange={(event) => setInternalNote(event.target.value)}
            placeholder="Add a private follow-up note..."
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            {isSaving ? "Saving..." : "Save follow-up"}
          </button>
        </div>
      </form>

      <div className="mt-5 grid gap-5 border-t border-base-300 pt-4 lg:grid-cols-2">
        <section aria-label="Internal notes">
          <h3 className="font-semibold">Internal notes</h3>
          {item.internalNotes?.length ? (
            <ul className="mt-2 space-y-2">
              {[...item.internalNotes].reverse().map((note) => (
                <li
                  key={note._id || `${note.authorId}-${note.createdAt}`}
                  className="rounded-md bg-base-200/60 p-3 text-sm"
                >
                  <p className="whitespace-pre-wrap">{note.note}</p>
                  <p className="mt-2 text-xs text-base-content/60">
                    {note.authorName} · {formatDate(note.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-base-content/60">No internal notes.</p>
          )}
        </section>

        <section aria-label="Resolution history">
          <h3 className="font-semibold">Resolution history</h3>
          {item.resolutionHistory?.length ? (
            <ol className="mt-2 space-y-2">
              {[...item.resolutionHistory].reverse().map((entry) => (
                <li
                  key={entry._id || `${entry.changedAt}-${entry.toStatus}`}
                  className="rounded-md border border-base-300 p-3 text-sm"
                >
                  <p className="font-medium">
                    {getStatusLabel(entry.fromStatus)} →{" "}
                    {getStatusLabel(entry.toStatus)}
                  </p>
                  {entry.note && (
                    <p className="mt-1 whitespace-pre-wrap">{entry.note}</p>
                  )}
                  <p className="mt-2 text-xs text-base-content/60">
                    {entry.changedByName} · {formatDate(entry.changedAt)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-base-content/60">
              No status changes recorded.
            </p>
          )}
        </section>
      </div>
    </article>
  );
};

export default AdminSubmissionCard;
