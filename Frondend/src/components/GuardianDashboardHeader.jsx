import {
  FaBullhorn,
  FaGraduationCap,
  FaSignOutAlt,
} from "react-icons/fa";

const GuardianDashboardHeader = ({
  theme,
  unreadAnnouncementCount,
  showAnnouncements,
  onToggleAnnouncements,
  onToggleTheme,
  onSignOut,
}) => {
  const isDark = theme === "dark";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
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
            onClick={onToggleAnnouncements}
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
            onClick={onToggleTheme}
            className={`btn btn-sm font-semibold ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-100 hover:border-blue-400 hover:bg-slate-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50"
            }`}
          >
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={onSignOut}
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
  );
};

export default GuardianDashboardHeader;
