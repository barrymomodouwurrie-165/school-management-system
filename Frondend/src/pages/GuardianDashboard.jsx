import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaUserFriends } from "react-icons/fa";
import Announcement from "../components/Announcement";
import GuardianContactForm from "../components/GuardianContactForm";
import GuardianDashboardHeader from "../components/GuardianDashboardHeader";
import GuardianStudentCard from "../components/GuardianStudentCard";
import {
  acknowledgeGuardianAlert,
  changeGuardianPassword,
  contactSchool,
  getGuardianPortal,
} from "../utils/guardianApi";
import { getAnnouncements } from "../utils/communicationApi";

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
      <GuardianDashboardHeader
        theme={theme}
        unreadAnnouncementCount={unreadAnnouncementCount}
        showAnnouncements={showAnnouncements}
        onToggleAnnouncements={() =>
          setShowAnnouncements((visible) => !visible)
        }
        onToggleTheme={toggleTheme}
        onSignOut={signOut}
      />

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
                  <GuardianStudentCard
                    key={child.id}
                    child={child}
                    isDark={isDark}
                    isUpdating={isUpdating}
                    mutedClass={mutedClass}
                    surfaceClass={surfaceClass}
                    onAcknowledge={handleAcknowledge}
                  />
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
              <GuardianContactForm
                children={portal.children}
                contact={contact}
                fieldClass={fieldClass}
                isDark={isDark}
                isUpdating={isUpdating}
                mutedClass={mutedClass}
                onChange={(field, value) =>
                  setContact((current) => ({ ...current, [field]: value }))
                }
                onSubmit={handleContactSchool}
                surfaceClass={surfaceClass}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default GuardianDashboard;
