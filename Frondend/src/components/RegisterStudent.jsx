import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router";
import { registerStudent } from "../utils/adminApi";

const JUNIOR_CLASSES = [7, 8, 9].flatMap((grade) =>
  [..."ABCDEFGHIJKLM"].map((letter) => `Grade ${grade} ${letter}`),
);
const SENIOR_CLASSES = [10, 11, 12].flatMap((grade) => [
  ...["Science", "Arts", "Commerce", "Agric", "Home Economics"].flatMap(
    (program) => [1, 2].map((stream) => `Grade ${grade} ${program} ${stream}`),
  ),
  `Grade ${grade} Technical`,
]);
const CLASS_OPTIONS = [
  ...JUNIOR_CLASSES.map((name) => ({ name, section: "Junior" })),
  ...SENIOR_CLASSES.map((name) => ({ name, section: "Senior" })),
];

const STUDENT_FIELDS = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  { name: "date_of_birth", label: "Date of birth", type: "date" },
  { name: "nationality", label: "Nationality" },
  { name: "ethnicity", label: "Ethnicity" },
  {
    name: "religion",
    label: "Religion",
    type: "select",
    options: ["Muslim", "Christian", "Others"],
  },
  { name: "previous_school", label: "Previous school" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female"],
  },
  { name: "phone_number", label: "Student phone", type: "tel" },
  { name: "enrollment_date", label: "Enrollment date", type: "date" },
  { name: "guardian_name", label: "Guardian name" },
  { name: "guardian_phone", label: "Guardian phone", type: "tel" },
  { name: "guardian_email", label: "Guardian email", type: "email", optional: true },
  { name: "guardian_address", label: "Guardian address", fullWidth: true },
];

const RegisterStudent = ({ isOpen, setIsOpen }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [credentials, setCredentials] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const studentData = Object.fromEntries(new FormData(form).entries());
    const classInfo = CLASS_OPTIONS.find(
      (item) => item.name === studentData.class,
    );
    if (!classInfo) {
      setStatus({ type: "error", message: "Please select a valid class." });
      return;
    }

    studentData.section = classInfo.section;
    if (!studentData.guardian_email) delete studentData.guardian_email;

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });
    setCredentials(null);
    try {
      const result = await registerStudent(studentData);
      setCredentials(result.credentials);
      setStatus({
        type: "success",
        message: result.message || "Student registered successfully.",
      });
      form.reset();
      setSelectedClass("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to register student.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 py-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold">REGISTER STUDENT</h2>
          <p className="text-base-content/70">
            Enrol a student and create their portal credentials
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl p-4">
        <section className="mb-4 rounded-lg border p-4 shadow-md">
          <h3 className="mb-3 text-lg font-bold">Student Details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDENT_FIELDS.slice(0, 10).map((field) => (
              <FormField key={field.name} field={field} />
            ))}
            <div className="form-control">
              <label className="label" htmlFor="student-class">
                <span className="label-text font-bold">Class</span>
              </label>
              <select
                id="student-class"
                name="class"
                className="select select-bordered select-sm rounded-md"
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select class
                </option>
                <optgroup label="Junior School">
                  {CLASS_OPTIONS.filter((item) => item.section === "Junior").map(
                    (item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ),
                  )}
                </optgroup>
                <optgroup label="Senior School">
                  {CLASS_OPTIONS.filter((item) => item.section === "Senior").map(
                    (item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ),
                  )}
                </optgroup>
              </select>
            </div>
          </div>
          {selectedClass && (
            <p className="mt-2 text-sm text-base-content/70">
              Section:{" "}
              {CLASS_OPTIONS.find((item) => item.name === selectedClass).section}
            </p>
          )}
        </section>

        <section className="mb-4 rounded-lg border p-4 shadow-md">
          <h3 className="mb-3 text-lg font-bold">Guardian Details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDENT_FIELDS.slice(10).map((field) => (
              <FormField key={field.name} field={field} />
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

        {credentials && (
          <div className="alert alert-info mb-4">
            <div>
              <p className="font-bold">Student login credentials</p>
              <p>Username: {credentials.username}</p>
              <p>Password: {credentials.password}</p>
              <p className="text-sm">
                Save these credentials and share them securely with the
                student.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            type="reset"
            onClick={() => {
              setSelectedClass("");
              setStatus({ type: "", message: "" });
              setCredentials(null);
            }}
            className="btn btn-outline btn-sm rounded-lg"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-sm rounded-lg"
          >
            {isSubmitting ? "Registering..." : "Register Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormField = ({ field }) => (
  <div
    className={`form-control ${field.fullWidth ? "sm:col-span-2" : ""}`}
  >
    <label className="label" htmlFor={`student-${field.name}`}>
      <span className="label-text font-bold">{field.label}</span>
    </label>
    {field.type === "select" ? (
      <select
        id={`student-${field.name}`}
        name={field.name}
        className="select select-bordered select-sm rounded-md"
        defaultValue=""
        required={!field.optional}
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
        id={`student-${field.name}`}
        name={field.name}
        type={field.type || "text"}
        className="input input-bordered input-sm rounded-md"
        required={!field.optional}
      />
    )}
  </div>
);

export default RegisterStudent;
