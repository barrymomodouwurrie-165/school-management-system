import { useState } from "react";
import { resetAdminStaffPassword } from "../utils/adminApi";

const StaffPasswordResetForm = () => {
  const [staffId, setStaffId] = useState("");
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
      const result = await resetAdminStaffPassword(staffId.trim(), newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setStatus({
        type: "success",
        message: result.message || "Staff password renewed successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to renew the staff password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-4 rounded-lg border p-4">
      <h3 className="font-bold">Renew staff password</h3>
      <p className="mb-3 text-sm text-base-content/70">
        Enter the staff ID and choose a new password for the staff member.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Staff ID</span>
            <input
              type="text"
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
              className="input input-bordered input-sm"
              autoComplete="off"
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="input input-bordered input-sm"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">
              Confirm password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="input input-bordered input-sm"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              required
            />
          </label>
        </div>
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`mt-3 text-sm ${
              status.type === "error" ? "text-error" : "text-success"
            }`}
          >
            {status.message}
          </p>
        )}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Renewing..." : "Renew password"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default StaffPasswordResetForm;
