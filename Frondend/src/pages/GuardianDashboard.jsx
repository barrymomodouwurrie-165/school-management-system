import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaGraduationCap,
  FaBullhorn,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";
import Announcement from "../components/Announcement";
import {
  acknowledgeGuardianAlert,
  changeGuardianPassword,
  contactSchool,
  getGuardianPortal,
} from "../utils/guardianApi";
import { getAnnouncements } from "../utils/communicationApi";

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
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnouncementCount, setUnreadAnnouncementCount] = useState(0);
  const [announcementError, setAnnouncementError] = useState("");
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

  useEffect(() => {
    const guardianName = portal?.guardian?.fullName;
    if (!guardianName || portal?.mustChangePassword) return undefined;

    let active = true;
    const storageKey = `guardian-seen-announcements:${guardianName.toLowerCase()}`;
    const refreshAnnouncements = async () => {
      try {
        const latestAnnouncements = await getAnnouncements();
        if (!active) return;

        const storedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (
          !Array.isArray(storedIds) ||
          storedIds.some((id) => typeof id !== "string")
        ) {
          throw new Error("Saved announcement read status is invalid.");
        }

        const seenIds = new Set(storedIds);
        setAnnouncements(latestAnnouncements);
        setAnnouncementError("");

        if (showAnnouncements) {
          latestAnnouncements.forEach((announcement) =>
            seenIds.add(announcement._id),
          );
          localStorage.setItem(storageKey, JSON.stringify([...seenIds]));
          setUnreadAnnouncementCount(0);
        } else {
          setUnreadAnnouncementCount(
            latestAnnouncements.filter(
              (announcement) => !seenIds.has(announcement._id),
            ).length,
          );
        }
      } catch (requestError) {
        if (active) {
          setAnnouncementError(
            requestError.message || "Unable to check for new announcements.",
          );
        }
      }
    };

    refreshAnnouncements();
    const intervalId = window.setInterval(refreshAnnouncements, 60_000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [portal?.guardian?.fullName, portal?.mustChangePassword, showAnnouncements]);

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
  const isDark = theme === "dark";
  const surfaceClass = isDark
    ? "border-slate-800 bg-slate-900 shadow-black/20"
    : "border-slate-200 bg-white shadow-slate-900/5";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const fieldClass = isDark
    ? "border-slate-700 bg-slate-950/60 text-slate-100"
    : "border-slate-200 bg-white text-slate-800";

  return (
    <main
      className={`min-h-screen bg-[radial-gradient(ellipse_at_85%_0%,rgba(216,227,255,0.55),transparent_30rem)] ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
          isDark
            ? "border-slate-800 bg-slate-900/90 text-slate-100"
            : "border-slate-200 bg-white/90 text-slate-800"
        }`}
      >
        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-900/20">
              <FaGraduationCap size={22} />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Guardian Progress Portal
              </h1>
              <p className={`text-xs sm:text-sm ${mutedClass}`}>
                Attendance, term progress, and school communication
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAnnouncements((visible) => !visible)}
              aria-expanded={showAnnouncements}
              aria-controls="guardian-announcements"
              aria-label={`Announcements${
                unreadAnnouncementCount
                  ? `, ${unreadAnnouncementCount} new`
                  : ""
              }`}
              className={`btn btn-sm ${
                isDark
                  ? "border-blue-400/30 bg-blue-400/10 text-blue-200 hover:bg-blue-400/20"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <span className="relative inline-flex">
                <FaBullhorn />
                {unreadAnnouncementCount > 0 && (
                  <span className="badge badge-error badge-xs absolute -right-3 -top-3 min-w-5 border-2 border-white px-1 text-[10px] font-bold text-white">
                    {unreadAnnouncementCount > 99
                      ? "99+"
                      : unreadAnnouncementCount}
                  </span>
                )}
              </span>
              {showAnnouncements ? "Hide announcements" : "Announcements"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`btn btn-sm font-semibold ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100 hover:border-blue-400 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={signOut}
              className={`btn btn-outline btn-sm ${
                isDark
                  ? "border-slate-700 text-slate-200 hover:border-blue-400 hover:bg-slate-800"
                  : "border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <FaSignOutAlt />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-12 sm:py-8">
        {announcementError && (
          <p role="alert" className="alert alert-error">
            {announcementError}
          </p>
        )}
        {showAnnouncements && (
          <section
            id="guardian-announcements"
            className={`overflow-hidden rounded-2xl border shadow-xl ${surfaceClass}`}
          >
            <Announcement announcements={announcements} />
          </section>
        )}
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
          <p role="status" className={`py-16 text-center ${mutedClass}`}>
            Loading your child's progress...
          </p>
        ) : !portal ? (
          <section className={`mx-auto max-w-xl rounded-2xl border p-6 text-center shadow-xl sm:p-8 ${surfaceClass}`}>
            <h2 className="text-xl font-bold">Portal information unavailable</h2>
            <p className={`my-3 text-sm ${mutedClass}`}>
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
          <section className={`mx-auto mt-[clamp(1.5rem,7vh,5rem)] max-w-xl rounded-2xl border p-6 shadow-xl sm:p-8 ${surfaceClass}`}>
            <h2 className="mb-2 text-xl font-bold">Secure your account</h2>
            <p className={`mb-5 text-sm ${mutedClass}`}>
              Set a private password before viewing linked student information.
            </p>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <label className="form-control">
                <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  Temporary password
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className={`input input-bordered ${fieldClass}`}
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
                <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  New password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  className={`input input-bordered ${fieldClass}`}
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
                <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  Confirm new password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  className={`input input-bordered ${fieldClass}`}
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
            <section className="relative isolate flex min-h-[190px] flex-wrap items-end justify-between gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-700 p-6 text-white shadow-xl shadow-blue-950/20 sm:p-8">
              <div className="pointer-events-none absolute -right-14 -bottom-28 -z-10 h-72 w-72 rounded-full border border-white/15 shadow-[0_0_0_2rem_rgba(255,255,255,0.04),0_0_0_4rem_rgba(255,255,255,0.03)]" />
              <div className="relative">
                <p className="text-sm font-semibold tracking-wide text-blue-100">Your family overview</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {portal?.guardian?.fullName}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-white/75">
                  A clear view of your child's learning, attendance, and what's
                  coming up.
                </p>
              </div>
              <div className="relative flex-none rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-md max-sm:w-full">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                  Current reporting period
                </p>
                <p className="mt-1 text-lg font-bold">
                  {portal?.term} · {portal?.academicYear}
                </p>
              </div>
            </section>

            {portal?.children?.length ? (
              <section className="grid items-start gap-5 lg:grid-cols-2">
                {portal.children.map((child) => (
                  <article
                    key={child.id}
                    className={`min-w-0 space-y-5 rounded-2xl border p-5 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl sm:p-6 ${surfaceClass}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">{child.fullName}</h3>
                        <p className={`mt-1 text-sm ${mutedClass}`}>
                          {child.studentId} · {child.className} · {child.section}
                        </p>
                      </div>
                      <span className={`badge border font-bold ${
                        isDark
                          ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}>
                        {child.term}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`min-w-0 rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}>
                        <p className={`text-xs font-medium ${mutedClass}`}>
                          Term attendance
                        </p>
                        <p className="mt-2 text-2xl font-bold tracking-tight">
                          {child.attendance.rate === null
                            ? "—"
                            : `${child.attendance.rate}%`}
                        </p>
                        <p className={`mt-1 text-xs leading-relaxed ${mutedClass}`}>
                          {child.attendance.presentDays} present of{" "}
                          {child.attendance.completedDays} completed days
                        </p>
                      </div>
                      <div className={`min-w-0 rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}>
                        <p className={`text-xs font-medium ${mutedClass}`}>
                          Published term average
                        </p>
                        <p className="mt-2 text-2xl font-bold tracking-tight">
                          {child.progress.average === null
                            ? "—"
                            : `${child.progress.average}%`}
                        </p>
                        <p className={`mt-1 text-xs leading-relaxed ${mutedClass}`}>
                          {child.progress.publishedSubjectCount} published
                          subjects
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <FaCalendarAlt className="text-primary" />
                        Recent attendance
                      </h4>
                      {child.attendance.recentDays.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {child.attendance.recentDays.map((day) => (
                            <li
                              key={`${day.date}-${day.status}`}
                              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                                isDark
                                  ? "border-slate-700 bg-slate-800 text-slate-200"
                                  : "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              {formatDate(day.date)} · {day.status}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`text-sm ${mutedClass}`}>
                          No attendance has been recorded this term.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <FaGraduationCap className="text-primary" />
                        Published results
                      </h4>
                      {child.progress.publishedSubjects.length ? (
                        <div className="overflow-x-auto">
                          <table className={`table table-sm overflow-hidden rounded-xl border ${
                            isDark ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"
                          }`}>
                            <thead className={isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}>
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
                        <p className={`text-sm ${mutedClass}`}>
                          Term results are not published yet.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <FaCalendarAlt className="text-primary" />
                        Upcoming exams
                      </h4>
                      {child.upcomingExams.length ? (
                        <ul className="space-y-2">
                          {child.upcomingExams.map((exam) => (
                            <li
                              key={exam.id}
                              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${
                                isDark
                                  ? "border-slate-700 bg-slate-800 text-slate-200"
                                  : "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span className="font-medium">{exam.title}</span>
                              <span className={`text-sm ${mutedClass}`}>
                                {formatDate(exam.startDate)}
                                {exam.startDate !== exam.endDate &&
                                  ` – ${formatDate(exam.endDate)}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`text-sm ${mutedClass}`}>
                          No upcoming exams are scheduled for this section.
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <FaExclamationTriangle className="text-warning" />
                        Progress alerts
                      </h4>
                      {child.alerts.length ? (
                        <ul className="space-y-2">
                          {child.alerts.map((alert) => (
                            <li
                              key={alert.key}
                              className={`rounded-xl border p-3 ${
                                isDark
                                  ? "border-amber-800 bg-amber-950/30"
                                  : "border-amber-200 bg-amber-50/80"
                              }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold">{alert.title}</p>
                                  <p className={`text-sm ${mutedClass}`}>
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
              <section className={`rounded-2xl border p-8 text-center shadow-xl ${surfaceClass}`}>
                <FaUserFriends className="mx-auto mb-3 text-primary" size={30} />
                <h3 className="text-lg font-bold">No linked students yet</h3>
                <p className={`mt-1 text-sm ${mutedClass}`}>
                  Contact the school office to connect your account to your child.
                </p>
              </section>
            )}

            {portal?.children?.length > 0 && (
              <section className={`scroll-mt-24 rounded-2xl border p-5 shadow-xl sm:p-6 ${surfaceClass}`}>
                <h3 className="mb-1 text-xl font-bold tracking-tight">Contact the school</h3>
                <p className={`mb-5 text-sm ${mutedClass}`}>
                  Send a question or concern to the school office about your child.
                </p>
                <form
                  onSubmit={handleContactSchool}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <label className="form-control">
                    <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Child
                    </span>
                    <select
                      className={`select select-bordered ${fieldClass}`}
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
                    <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Message type
                    </span>
                    <select
                      className={`select select-bordered ${fieldClass}`}
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
                    <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Topic
                    </span>
                    <select
                      className={`select select-bordered ${fieldClass}`}
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
                    <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Subject
                    </span>
                    <input
                      className={`input input-bordered ${fieldClass}`}
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
                    <span className={`label-text mb-1 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Message
                    </span>
                    <textarea
                      className={`textarea textarea-bordered min-h-28 ${fieldClass}`}
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
