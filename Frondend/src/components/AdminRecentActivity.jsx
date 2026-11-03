import {
  FaClipboardCheck,
  FaExclamationTriangle,
  FaLightbulb,
  FaRegCommentDots,
  FaUserShield,
} from "react-icons/fa";

const ACTIVITY_PRESENTATION = {
  attendance: { icon: FaClipboardCheck, color: "text-blue-700 bg-blue-100" },
  results: { icon: FaUserShield, color: "text-indigo-700 bg-indigo-100" },
  report: { icon: FaExclamationTriangle, color: "text-red-700 bg-red-100" },
  suggestion: { icon: FaLightbulb, color: "text-amber-700 bg-amber-100" },
  complaint: { icon: FaRegCommentDots, color: "text-orange-700 bg-orange-100" },
};

const formatActivityTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const AdminRecentActivity = ({ activities = [], isLoading, error }) => (
  <section className="max-w-3xl rounded-lg border border-base-content/20 px-4 py-4">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Recent Alerts</h2>
        <p className="text-sm text-base-content/60">Today&apos;s staff and student activity</p>
      </div>
      <span className="badge badge-primary">{activities.length}</span>
    </div>

    {error ? (
      <p role="alert" className="text-sm text-error">
        {error}
      </p>
    ) : isLoading ? (
      <p role="status" className="py-4 text-sm text-base-content/60">
        Loading today&apos;s activity...
      </p>
    ) : activities.length === 0 ? (
      <p className="py-4 text-sm text-base-content/60">
        No staff or student activities have been recorded today.
      </p>
    ) : (
      <div className="space-y-4">
        {activities.map((activity) => {
          const presentation =
            ACTIVITY_PRESENTATION[activity.type] ??
            ACTIVITY_PRESENTATION.attendance;
          const Icon = presentation.icon;

          return (
            <article key={activity.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 rounded-lg p-2 ${presentation.color}`}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{activity.title}</p>
                <p className="break-words text-sm">{activity.detail}</p>
                <p className="text-xs text-base-content/60">
                  {formatActivityTime(activity.createdAt)}
                  {" · "}
                  {activity.actor}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default AdminRecentActivity;
