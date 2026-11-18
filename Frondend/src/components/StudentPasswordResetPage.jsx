import { useState } from "react";
import { resetAdminStudentPassword } from "../utils/adminApi";

const StudentPasswordResetPage = ({ student, onBack }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetAdminStudentPassword(
        student.student_id,
        newPassword,
      );
      setNewPassword("");
      setConfirmPassword("");
      setStatus({
        type: "success",
        message: result.message || "Student password renewed successfully.",
      });
    } catch (requestError) {
      setStatus({
        type: "error",
        message:
          requestError.message || "Unable to renew the student password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) {
    return (
      <main className="mx-auto max-w-3xl p-4">
        <p role="alert" className="mb-3 text-error">
          Select a student before renewing a password.
        </p>
        <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
          Back to class
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Renew student password</h1>
          <p className="text-sm text-base-content/70">
            Set a new password for this student.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back to class
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <strong>Student ID:</strong> {student.student_id}
          </p>
          <p>
            <strong>Name:</strong> {student.first_name} {student.last_name}
          </p>
        </div>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">New password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="input input-bordered input-sm"
            autoComplete="new-password"
            minLength={9}
            maxLength={128}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-semibold">Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input input-bordered input-sm"
            autoComplete="new-password"
            minLength={9}
            maxLength={128}
            required
          />
        </label>
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`text-sm ${
              status.type === "error" ? "text-error" : "text-success"
            }`}
          >
            {status.message}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Renewing..." : "Renew password"}
        </button>
      </form>
    </main>
  );
};

export default StudentPasswordResetPage;
