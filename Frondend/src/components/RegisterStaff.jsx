import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router";
import { registerStaff } from "../utils/adminApi";

const STAFF_FIELDS = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female"],
  },
  { name: "nationality", label: "Nationality", placeholder: "e.g. Gambian" },
  { name: "phone_number", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "address", label: "Address" },
  { name: "ethnicity", label: "Ethnicity" },
  {
    name: "marital_status",
    label: "Marital status",
    type: "select",
    options: ["Single", "Married"],
  },
  { name: "staff_id", label: "Staff ID" },
  {
    name: "qualification",
    label: "Highest qualification",
    type: "select",
    options: ["ECD", "PTC", "HTC", "Diploma", "BA/BSc", "Master's", "PhD"],
  },
  {
    name: "role",
    label: "Staff position",
    type: "select",
    options: ["Teacher", "H.O.D", "H.O.B", "Admin"],
  },
  {
    name: "subject_taught",
    label: "Subject taught",
    type: "select",
    options: [
      "English Language",
      "Mathematics",
      "Financial Accounting",
      "Cost Accounting",
      "Others",
    ],
  },
  { name: "department", label: "Department" },
  {
    name: "section",
    label: "Section",
    type: "select",
    options: ["Junior", "Senior"],
  },
  {
    name: "employment_type",
    label: "Employment type",
    type: "select",
    options: ["Full-time", "Part-time", "Contract"],
  },
  { name: "start_date", label: "Start date", type: "date" },
  { name: "username", label: "Username", autoComplete: "username" },
  {
    name: "password",
    label: "Temporary password",
    type: "password",
    autoComplete: "new-password",
  },
];

const RegisterStaff = ({ isOpen, setIsOpen }) => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const staff = Object.fromEntries(formData.entries());
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await registerStaff(staff);
      form.reset();
      setStatus({
        type: "success",
        message: result.message || "Staff member registered successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to register staff.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 py-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold font-sans">REGISTER STAFF</h2>
          <p className="text-base-content/70">
            Add a staff account and sign-in credentials
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl p-2">
        <section className="mb-3 rounded-lg border p-4 shadow-md">
          <h3 className="mb-3 font-bold">Staff Details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STAFF_FIELDS.map((field) => (
              <div key={field.name} className="form-control">
                <label className="label" htmlFor={`staff-${field.name}`}>
                  <span className="label-text font-bold">{field.label}</span>
                </label>
                {field.type === "select" ? (
                  <select
                    id={`staff-${field.name}`}
                    name={field.name}
                    className="select select-bordered select-sm rounded-md"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select {field.label.toLowerCase()}
                    </option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`staff-${field.name}`}
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    minLength={field.name === "password" ? 6 : undefined}
                    className="input input-bordered input-sm rounded-md"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`mb-3 text-sm ${
              status.type === "error" ? "text-error" : "text-success"
            }`}
          >
            {status.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="reset"
            onClick={() => setStatus({ type: "", message: "" })}
            className="btn btn-outline btn-sm rounded-lg"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-sm rounded-lg"
          >
            {isSubmitting ? "Registering..." : "Register Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStaff;
