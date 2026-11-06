import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaGraduationCap,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";
import {
  acknowledgeGuardianAlert,
  changeGuardianPassword,
  contactSchool,
  getGuardianPortal,
} from "../utils/guardianApi";

const formatDate = (date) => {
  if (!date) return "Date not available";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date not available"
    : parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
};

const GuardianDashboard = ({ theme, toggleTheme }) => {
  const [portal, setPortal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [contact, setContact] = useState({
    studentId: "",
    type: "suggestion",
    category: "Progress",
    subject: "",
    details: "",
  });
  const navigate = useNavigate();

  const loadPortal = useCallback(async () => {
    try {
      const data = await getGuardianPortal();
      setError("");
      setPortal(data);
      if (data.children?.length) {
        setContact((current) => ({
          ...current,
          studentId: current.studentId || data.children[0].id,
        }));
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to load the guardian portal.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => getGuardianPortal())
      .then((data) => {
        if (!active) return;
        setError("");
        setPortal(data);
        if (data.children?.length) {
          setContact((current) => ({
            ...current,
            studentId: current.studentId || data.children[0].id,
          }));
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.message || "Unable to load the guardian portal.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }
    if (passwords.newPassword.length < 10) {
      setError("Your new password must be at least 10 characters long.");
      return;
    }

    setIsUpdating(true);
    try {
      await changeGuardianPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNotice("Password updated. Your child's progress is now available.");
      await loadPortal();
    } catch (requestError) {
      setError(requestError.message || "Unable to update your password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcknowledge = async (studentId, alertKey) => {
    setIsUpdating(true);
    setError("");
    setNotice("");
    try {
      await acknowledgeGuardianAlert(studentId, alertKey);
      setNotice("Alert acknowledged.");
      await loadPortal();
    } catch (requestError) {
      setError(requestError.message || "Unable to acknowledge the alert.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactSchool = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    setError("");
    setNotice("");
    try {
      const response = await contactSchool(contact);
      setNotice(response.message || "Your message was sent to the school.");
      setContact((current) => ({
        ...current,
        subject: "",
        details: "",
      }));
    } catch (requestError) {
      setError(requestError.message || "Unable to contact the school.");
    } finally {
      setIsUpdating(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/login?role=guardian");
  };

  const mustChangePassword = portal?.mustChangePassword;

  return (
    <main
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <header className="border-b border-primary/20 bg-base-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 p-3 text-primary">
              <FaGraduationCap size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold">Guardian Progress Portal</h1>
              <p className="text-sm text-base-content/70">
                Attendance, term progress, and school communication
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="btn btn-sm">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="btn btn-outline btn-sm"
            >
              <FaSignOutAlt />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {error && (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="alert alert-success">
            {notice}
          </p>
        )}
        {isLoading ? (
          <p role="status" className="py-12 text-center">
            Loading your child's progress...
          </p>
        ) : !portal ? (
          <section className="mx-auto max-w-xl rounded-xl bg-base-100 p-6 text-center shadow">
            <h2 className="text-xl font-bold">Portal information unavailable</h2>
            <p className="my-3 text-sm text-base-content/70">
              Sign in again or retry to load the guardian portal.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                loadPortal();
              }}
              className="btn btn-primary"
            >
              Retry
            </button>
          </section>
        ) : mustChangePassword ? (
          <section className="mx-auto max-w-xl rounded-xl bg-base-100 p-6 shadow">
            <h2 className="mb-2 text-xl font-bold">Secure your account</h2>
            <p className="mb-5 text-sm text-base-content/70">
              Set a private password before viewing linked student information.
            </p>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Temporary password
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="input input-bordered"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  New password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  className="input input-bordered"
                  value={passwords.newPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Confirm new password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  className="input input-bordered"
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary w-full"
              >
                {isUpdating ? "Updating..." : "Change password"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-base-content/70">Welcome</p>
                <h2 className="text-2xl font-bold">
                  {portal?.guardian?.fullName}
                </h2>
              </div>
              <div className="rounded-lg bg-base-100 px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-base-content/60">
                  Current reporting period
                </p>
                <p className="font-semibold">
                  {portal?.term} · {portal?.academicYear}
                </p>
              </div>
            </section>

            {portal?.children?.length ? (
              <section className="grid gap-5 lg:grid-cols-2">
                {portal.children.map((child) => (
                  <article
                    key={child.id}
                    className="space-y-4 rounded-xl bg-base-100 p-5 shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold">{child.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                          {child.studentId} · {child.className} · {child.section}
                        </p>
                      </div>
                      <span className="badge badge-primary badge-outline">
                        {child.term}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-base-200 p-3">
                        <p className="text-xs text-base-content/70">
                          Term attendance
                        </p>
                        <p className="text-2xl font-bold">
                          {child.attendance.rate === null
                            ? "—"
                            : `${child.attendance.rate}%`}
                        </p>
                        <p className="text-xs text-base-content/70">
                          {child.attendance.presentDays} present of{" "}
                          {child.attendance.completedDays} completed days
                        </p>
                      </div>
                      <div className="rounded-lg bg-base-200 p-3">
                        <p className="text-xs text-base-content/70">
                          Published term average
                        </p>
                        <p className="text-2xl font-bold">
                          {child.progress.average === null
                            ? "—"
                            : `${child.progress.average}%`}
                        </p>
                        <p className="text-xs text-base-content/70">
                          {child.progress.publishedSubjectCount} published
                          subjects
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <FaCalendarAlt className="text-primary" />
                        Recent attendance
                      </h4>
                      {child.attendance.recentDays.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {child.attendance.recentDays.map((day) => (
                            <li
                              key={`${day.date}-${day.status}`}
                              className="rounded-md border px-2 py-1 text-xs"
                            >
                              {formatDate(day.date)} · {day.status}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-base-content/60">
                          No attendance has been recorded this term.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <FaGraduationCap className="text-primary" />
                        Published results
                      </h4>
                      {child.progress.publishedSubjects.length ? (
                        <div className="overflow-x-auto">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {child.progress.publishedSubjects.map((result) => (
                                <tr key={result.subject}>
                                  <td>{result.subject}</td>
                                  <td>{result.total}%</td>
                                  <td>{result.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-base-content/60">
                          Term results are not published yet.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <FaCalendarAlt className="text-primary" />
                        Upcoming exams
                      </h4>
                      {child.upcomingExams.length ? (
                        <ul className="space-y-2">
                          {child.upcomingExams.map((exam) => (
                            <li
                              key={exam.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                            >
                              <span className="font-medium">{exam.title}</span>
                              <span className="text-sm text-base-content/70">
                                {formatDate(exam.startDate)}
                                {exam.startDate !== exam.endDate &&
                                  ` – ${formatDate(exam.endDate)}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-base-content/60">
                          No upcoming exams are scheduled for this section.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <FaExclamationTriangle className="text-warning" />
                        Progress alerts
                      </h4>
                      {child.alerts.length ? (
                        <ul className="space-y-2">
                          {child.alerts.map((alert) => (
                            <li
                              key={alert.key}
                              className="rounded-lg border border-warning/40 p-3"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold">{alert.title}</p>
                                  <p className="text-sm text-base-content/70">
                                    {alert.message}
                                  </p>
                                </div>
                                {alert.acknowledged ? (
                                  <span className="badge badge-success gap-1">
                                    <FaCheck /> Acknowledged
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() =>
                                      handleAcknowledge(child.id, alert.key)
                                    }
                                    className="btn btn-outline btn-xs"
                                  >
                                    Acknowledge
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-base-content/60">
                          There are no active alerts for this term.
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <section className="rounded-xl bg-base-100 p-8 text-center shadow">
                <FaUserFriends className="mx-auto mb-3 text-primary" size={30} />
                <h3 className="text-lg font-bold">No linked students yet</h3>
                <p className="mt-1 text-sm text-base-content/70">
                  Contact the school office to connect your account to your child.
                </p>
              </section>
            )}

            {portal?.children?.length > 0 && (
              <section className="rounded-xl bg-base-100 p-5 shadow">
                <h3 className="mb-1 text-xl font-bold">Contact the school</h3>
                <p className="mb-4 text-sm text-base-content/70">
                  Send a question or concern to the school office about your child.
                </p>
                <form
                  onSubmit={handleContactSchool}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <label className="form-control">
                    <span className="label-text mb-1 font-semibold">
                      Child
                    </span>
                    <select
                      className="select select-bordered"
                      value={contact.studentId}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          studentId: event.target.value,
                        }))
                      }
                      required
                    >
                      {portal.children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text mb-1 font-semibold">
                      Message type
                    </span>
                    <select
                      className="select select-bordered"
                      value={contact.type}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          type: event.target.value,
                        }))
                      }
                    >
                      <option value="suggestion">Question or suggestion</option>
                      <option value="complaint">Concern</option>
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text mb-1 font-semibold">
                      Topic
                    </span>
                    <select
                      className="select select-bordered"
                      value={contact.category}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                    >
                      <option>Progress</option>
                      <option>Attendance</option>
                      <option>Exams</option>
                      <option>General inquiry</option>
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text mb-1 font-semibold">
                      Subject
                    </span>
                    <input
                      className="input input-bordered"
                      value={contact.subject}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          subject: event.target.value,
                        }))
                      }
                      maxLength={160}
                      required
                    />
                  </label>
                  <label className="form-control md:col-span-2">
                    <span className="label-text mb-1 font-semibold">
                      Message
                    </span>
                    <textarea
                      className="textarea textarea-bordered min-h-28"
                      value={contact.details}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          details: event.target.value,
                        }))
                      }
                      maxLength={3000}
                      required
                    />
                  </label>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn btn-primary"
                    >
                      {isUpdating ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default GuardianDashboard;
