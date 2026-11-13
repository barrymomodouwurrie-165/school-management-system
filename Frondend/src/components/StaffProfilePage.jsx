const formatValue = (value, fallback = "Not provided") => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }
  return value || fallback;
};

const StaffProfilePage = ({ staff, onBack }) => {
  const fields = [
    ["Staff ID", staff.staff_id],
    ["Status", staff.staff_position],
    ["Username", staff.username],
    ["Gender", staff.gender],
    ["Email", staff.email],
    ["Phone", staff.phone_number],
    ["Address", staff.address],
    ["Nationality", staff.nationality],
    ["Ethnicity", staff.ethnicity],
    ["Marital status", staff.marital_status],
    ["Qualification", staff.qualification],
    ["Department", staff.department],
    ["Section", staff.section],
    ["Employment type", staff.employment_type],
    ["Start date", staff.start_date],
    ["Primary subject", staff.subject_taught],
    ["Assigned subjects", formatValue(staff.assigned_subjects, "Not assigned")],
    ["Teaching classes", formatValue(staff.assigned_classes, "Not assigned")],
  ];

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Staff profile</h1>
          <p className="text-sm text-base-content/70">
            Staff information and teaching assignments.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBack}
        >
          Back to staff
        </button>
      </header>

      <section className="rounded-lg border p-4 shadow-sm">
        <div className="mb-5 flex items-center gap-4 border-b pb-4">
          {staff.profile_image ? (
            <img
              src={staff.profile_image}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-950 text-xl font-bold text-white"
            >
              {`${staff.first_name?.[0] ?? ""}${staff.last_name?.[0] ?? ""}`.toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">
              {staff.first_name} {staff.last_name}
            </h2>
            <p className="text-sm text-base-content/70">
              {staff.staff_position || "Staff"} · {staff.department || "No department"}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-md bg-base-200/50 p-3">
              <dt className="text-sm font-semibold">{label}</dt>
              <dd className="mt-1 break-words text-sm text-base-content/80">
                {formatValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
};

export default StaffProfilePage;
