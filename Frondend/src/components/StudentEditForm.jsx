import { useState } from "react";
import { updateAdminStudent } from "../utils/adminApi";

const STUDENT_FIELDS = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  { name: "gender", label: "Gender", options: ["Male", "Female"] },
  { name: "date_of_birth", label: "Date of birth", type: "date" },
  { name: "nationality", label: "Nationality" },
  { name: "phone_number", label: "Student phone", type: "tel" },
  { name: "ethnicity", label: "Ethnicity" },
  { name: "religion", label: "Religion", options: ["Muslim", "Christian", "Others"] },
  { name: "previous_school", label: "Previous school" },
  { name: "section", label: "Section", options: ["Junior", "Senior"] },
  { name: "class", label: "Class" },
  { name: "enrollment_date", label: "Enrollment date", type: "date" },
  { name: "guardian_name", label: "Guardian name" },
  { name: "guardian_phone", label: "Guardian phone", type: "tel" },
  { name: "guardian_email", label: "Guardian email", type: "email", optional: true },
  { name: "guardian_address", label: "Guardian address" },
  {
    name: "status",
    label: "Status",
    options: ["", "Active", "Suspended", "Transferred"],
    optional: true,
  },
];

const StudentEditForm = ({ student, onCancel, onSaved }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      STUDENT_FIELDS.map(({ name }) => [name, student[name] ?? ""]),
    ),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await updateAdminStudent(student._id, values);
      onSaved(result.student, result.message);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update student details.",
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
            Edit {student.first_name} {student.last_name}
          </h1>
          <p className="text-sm text-base-content/70">
            Correct student and guardian details. Student ID and login
            credentials cannot be changed here.
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

      <div className="mb-4 grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <p>
          <strong>Student ID:</strong> {student.student_id}
        </p>
        <p>
          <strong>Username:</strong> {student.username || student.student_id}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="grid grid-cols-1 gap-3 rounded-lg border p-4 shadow-sm sm:grid-cols-2">
          {STUDENT_FIELDS.map((field) => {
            const currentValue = values[field.name];
            const options =
              field.options &&
              currentValue &&
              !field.options.includes(currentValue)
                ? [currentValue, ...field.options]
                : field.options;

            return (
              <label
                key={field.name}
                htmlFor={`edit-student-${field.name}`}
                className={`form-control ${
                  field.name === "guardian_address" ? "sm:col-span-2" : ""
                }`}
              >
                <span className="label-text mb-1 font-semibold">
                  {field.label}
                </span>
                {options ? (
                  <select
                    id={`edit-student-${field.name}`}
                    name={field.name}
                    value={currentValue}
                    onChange={handleChange}
                    className="select select-bordered select-sm"
                    required={!field.optional}
                  >
                    {options.map((option) => (
                      <option key={option || "not-set"} value={option}>
                        {option || "Not set"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`edit-student-${field.name}`}
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
            disabled={isSaving}
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

export default StudentEditForm;
