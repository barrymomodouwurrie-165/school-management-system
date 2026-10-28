import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { submitCommunication } from "../../utils/communicationApi";

const StudentSubmissionPage = ({ config }) => {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (event) => {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await submitCommunication({ type: config.type, ...values });

      setValues({});
      setStatus({
        type: "success",
        message: "Your submission was sent to the school administration.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-4 rounded-md px-4 py-3 shadow-md">
        <p className="text-sm text-base-content/70">Student Portal</p>
        <h1 className="text-xl font-bold text-blue-600">{config.title}</h1>
        <p className="mt-1 text-sm text-base-content/70">
          {config.description}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-md p-4 shadow-md">
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div
              key={field.name}
              className={`form-control ${field.fullWidth ? "sm:col-span-2" : ""}`}
            >
              <label className="label" htmlFor={field.name}>
                <span className="label-text font-medium">{field.label}</span>
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={updateValue}
                  className="select select-bordered rounded-md"
                  required={field.required !== false}
                >
                  <option value="" disabled>
                    Choose an option
                  </option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={updateValue}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  required={field.required !== false}
                  className="textarea textarea-bordered min-h-40 rounded-md"
                />
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-3 rounded-md bg-blue-600/10 p-3">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={values[field.name] || false}
                    onChange={updateValue}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm">{field.description}</span>
                </label>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={values[field.name] || ""}
                  onChange={updateValue}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  required={field.required !== false}
                  className="input input-bordered rounded-md"
                />
              )}
            </div>
          ))}
        </div>

        {status.message && (
          <p
            role="status"
            className={`mt-4 text-sm ${
              status.type === "success" ? "text-success" : "text-error"
            }`}
          >
            {status.message}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-sm rounded-md"
          >
            <FaPaperPlane />
            {isSubmitting ? "Sending..." : config.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentSubmissionPage;
