import { useEffect, useState } from "react";
import { getAcademicSubjects, updateAdminStaff } from "../utils/adminApi";
import { STAFF_STATUSES } from "../utils/staffStatuses";

const STAFF_FIELDS = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  { name: "gender", label: "Gender", options: ["Male", "Female"] },
  { name: "nationality", label: "Nationality" },
  { name: "phone_number", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "address", label: "Address" },
  { name: "ethnicity", label: "Ethnicity", optional: true },
  {
    name: "marital_status",
    label: "Marital status",
    options: ["Single", "Married"],
  },
  {
    name: "qualification",
    label: "Highest qualification",
    options: [
      "ECD",
      "PTC",
      "HTC",
      "Diploma",
      "Advance Diploma",
      "BA/BSc",
      "Master's",
      "PhD",
    ],
  },
  {
    name: "staff_position",
    label: "Staff status",
    options: STAFF_STATUSES,
  },
  {
    name: "subject_taught",
    label: "Primary subject",
    subject: true,
  },
  { name: "department", label: "Department" },
  { name: "section", label: "Section", options: ["Junior", "Senior"] },
  {
    name: "employment_type",
    label: "Employment type",
    options: ["Full-time", "Part-time", "Contract"],
  },
  { name: "start_date", label: "Start date", type: "date" },
  { name: "username", label: "Username" },
];

const StaffEditForm = ({ staff, onCancel, onSaved }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      STAFF_FIELDS.map(({ name }) => [name, staff[name] ?? ""]),
    ),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subjectsError, setSubjectsError] = useState("");

  useEffect(() => {
    let active = true;
    getAcademicSubjects()
      .then((subjects) => {
        if (active) {
          setSubjectOptions(
            [...new Set(subjects.map((subject) => subject.name))].sort(),
          );
        }
      })
      .catch((error) => {
        if (active) setSubjectsError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await updateAdminStaff(staff._id, values);
      onSaved(result.staff, result.message);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update staff details.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">
            Edit {staff.first_name} {staff.last_name}
          </h1>
          <p className="text-sm text-base-content/70">
            Update staff information. Password changes are not available here.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          Back
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="grid grid-cols-1 gap-3 rounded-lg border p-4 shadow-sm sm:grid-cols-2">
          {STAFF_FIELDS.map((field) => {
            const currentValue = values[field.name];
            const fieldOptions = field.subject
              ? subjectOptions
              : field.options;
            const options =
              fieldOptions &&
              currentValue &&
              !fieldOptions.includes(currentValue)
                ? [currentValue, ...fieldOptions]
                : fieldOptions;

            return (
              <label
                key={field.name}
                htmlFor={`edit-staff-${field.name}`}
                className="form-control"
              >
                <span className="label-text mb-1 font-semibold">
                  {field.label}
                </span>
                {options ? (
                  <select
                    id={`edit-staff-${field.name}`}
                    name={field.name}
                    value={currentValue}
                    onChange={handleChange}
                    className="select select-bordered select-sm"
                    required={!field.optional}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`edit-staff-${field.name}`}
                    name={field.name}
                    type={field.type || "text"}
                    value={currentValue}
                    onChange={handleChange}
                    className="input input-bordered input-sm"
                    required={!field.optional}
                  />
                )}
              </label>
            );
          })}
        </section>

        {subjectsError && (
          <p className="my-3 text-sm text-error" role="alert">
            Could not load the subject list: {subjectsError}
          </p>
        )}
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`my-3 text-sm ${
              status.type === "error" ? "text-error" : "text-success"
            }`}
          >
            {status.message}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            disabled={isSaving || Boolean(subjectsError)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default StaffEditForm;
