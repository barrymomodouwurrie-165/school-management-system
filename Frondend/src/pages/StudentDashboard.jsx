import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBars,
  FaBullhorn,
  FaClipboardCheck,
  FaFileAlt,
  FaRobot,
  FaFlag,
  FaUsers,
  FaUserCircle,
} from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import StudentSidebar from "../components/StudentSidebar";
import Announcement from "../components/Announcement";
import Classmates from "../components/StudentSideBarComponents/Classmates";
import Attendance from "../components/StudentSideBarComponents/Attendance";
import AiAssistance from "../components/StudentSideBarComponents/AiAssistance";
import ResultCheck from "../components/StudentSideBarComponents/ResultCheck";
import ExamsContent from "../components/ExamsContent";
import SideBarNav from "../components/StudentSideBarComponents/SideBarNav";
import ViewResult from "../components/StudentSideBarComponents/ViewResult";
import ReportStudent from "../components/StudentSideBarComponents/ReportStudent";
import SendSuggestion from "../components/StudentSideBarComponents/SendSuggestion";
import SendComplaint from "../components/StudentSideBarComponents/SendComplaint";
import StudentProfilePage from "../components/StudentSideBarComponents/StudentProfilePage";
import MySubjects from "../components/StudentSideBarComponents/MySubjects";
import {
  getStudentAttendance,
  getStudentAcademicSummary,
  getStudentProfile,
} from "../utils/studentApi";
import LogoutButton from "../components/LogoutButton";

const StudentExamDetails = () => <ExamsContent viewer="student" readOnly />;

const formatEnrollmentDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
};

const StudentDashboard = ({ theme, toggleTheme }) => {
  const [activePage, setActivePage] = useState("announcements");
  const [pageHistory, setPageHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [dashboardMetrics, setDashboardMetrics] = useState({
    academicMetric: null,
    academicMetricLabel: "CGPA",
    attendance: null,
  });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentProfile()
      .then((studentProfile) => {
        if (active) {
          setProfile(studentProfile);
          setDashboardMetrics((current) => ({
            ...current,
            academicMetricLabel:
              studentProfile.section === "Junior" ? "Aggregate" : "CGPA",
          }));
        }
      })
      .catch((error) => {
        if (active) setProfileError(error.message);
      })
      .finally(() => {
        if (active) setIsProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getStudentAcademicSummary(),
      getStudentAttendance(),
    ]).then(([academicResult, attendanceResult]) => {
        if (!active) return;
        const failures = [];
        if (academicResult.status === "fulfilled") {
          const academicSummary = academicResult.value;
          const isJunior = academicSummary.section === "Junior";
          setDashboardMetrics((current) => ({
            ...current,
            academicMetricLabel: isJunior ? "Aggregate" : "CGPA",
            academicMetric: isJunior
              ? academicSummary.aggregate?.aggregate ?? null
              : academicSummary.publishedSubjectCount > 0
                ? academicSummary.cgpa
                : null,
          }));
        } else {
          failures.push(academicResult.reason.message);
        }
        if (attendanceResult.status === "fulfilled") {
          setDashboardMetrics((current) => ({
            ...current,
            attendance: attendanceResult.value.overallAttendance,
          }));
        } else {
          failures.push(attendanceResult.reason.message);
        }
        setMetricsError(failures.join(" "));
      })
      .finally(() => {
        if (active) setMetricsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const PAGES = {
    announcements: Announcement,
    classmates: Classmates,
    attendance: Attendance,
    ai: AiAssistance,
    "check-result": ResultCheck,
    "exam-details": StudentExamDetails,
    "report-student": ReportStudent,
    suggestion: SendSuggestion,
    complaint: SendComplaint,
    profile: StudentProfilePage,
    "my-subjects": MySubjects,
  };

  const ActivePage = PAGES[activePage] && PAGES[activePage];
  const navigateToPage = (page) => {
    if (page !== activePage) {
      setPageHistory((history) => [...history, activePage]);
      setActivePage(page);
    }
    setOpen(false);
    setViewResult(false);
  };
  const navigateBack = () => {
    if (viewResult) {
      setViewResult(false);
      return;
    }
    if (!pageHistory.length) {
      setOpen(true);
      return;
    }
    setActivePage(pageHistory[pageHistory.length - 1]);
    setPageHistory((history) => history.slice(0, -1));
    setOpen(false);
  };

  const NAV_ITEMS = [
    { id: "announcements", label: "Announcements", icon: FaBullhorn },
    { id: "classmates", label: "Classmates", icon: FaUsers },
    { id: "attendance", label: "Attendance", icon: FaClipboardCheck },
    {
      id: "academics",
      label: "Academics",
      icon: FaFileAlt,
      children: [
        { id: "my-subjects", label: "My Subjects" },
        { id: "check-result", label: "Check Result" },
        { id: "exam-details", label: "Exam Details" },
      ],
    },
    { id: "ai", label: "AI Study Coach", icon: FaRobot },
    { id: "profile", label: "My Profile", icon: FaUserCircle },
    {
      id: "reports",
      label: "Reports",
      icon: FaFlag,
      children: [
        { id: "complaint", label: "Send Complaint" },
        { id: "report-student", label: "Report Student" },
        { id: "suggestion", label: "Send Suggestion" },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen py-4 md:pl-[220px] ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <StudentSidebar
        activePage={activePage}
        onNavigate={navigateToPage}
        NAV_ITEMS={NAV_ITEMS}
        viewResult={viewResult}
        setViewResult={setViewResult}
        profile={profile}
      />
      <nav
        aria-label="Mobile page navigation"
        className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-2 md:hidden"
      >
        <button
          type="button"
          onClick={navigateBack}
          className="btn btn-ghost btn-sm"
          aria-label={pageHistory.length || viewResult ? "Go back" : "Open menu"}
        >
          <FaArrowLeft />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold">
          {viewResult
            ? "Result"
            : NAV_ITEMS.flatMap((item) => [item, ...(item.children || [])]).find(
                (item) => item.id === activePage,
              )?.label}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-outline btn-sm"
          aria-expanded={open}
          aria-label="Open navigation menu"
        >
          <FaBars />
          Menu
        </button>
      </nav>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="developer-credit text-sm text-base-content/70">
            Designed and Developed by BarryDev-HUB
          </p>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-sm rounded-full border border-primary/20 bg-primary/5 text-primary"
          >
            {theme === "corporate" ? "Dark mode" : "Light mode"}
          </button>
        </div>
        <div className="p-2 grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_auto] border-t-2 border-primary rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className=" w-[50px] h-[50px] flex items-center justify-center bg-blue-950/70 rounded-lg text-white font-bold">
              {profile?.fullName
                ? profile.fullName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                : "--"}
            </div>
          </div>

          {open ? (
            <div
              className="fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-blue-950 px-2 shadow-2xl shadow-slate-950/40 md:flex"
            >
              <div className="z-50 flex w-[210px] flex-shrink-0 items-start justify-between py-2 text-center">
                <div className="flex flex-1 flex-col items-center text-white">
                  <p className="font-bold text-xl">
                    Junior and Senior School Management
                  </p>
                  <p className="text-sm text-white/60">Student Portal</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <MdExitToApp size={20} />
                </button>
              </div>
              <div className=" flex-1 overflow-y-auto [scrollbar-width:none] p-2 text-white/60 mt-2">
                <div className="flex flex-col pl-2">
                  <SideBarNav
                    NAV_ITEMS={NAV_ITEMS}
                    activePage={activePage}
                    onNavigate={navigateToPage}
                    open={open}
                    setOpen={setOpen}
                    viewResult={viewResult}
                    setViewResult={setViewResult}
                  />
                  <div>
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          ) : viewResult ? (
            ""
          ) : (
            <div className="md:flex items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-blue-600">
                  {isProfileLoading
                    ? "Loading your profile..."
                    : profile
                      ? `Welcome back, ${profile.fullName}`
                      : "Welcome back"}
                </h1>
                {profileError && (
                  <p className="text-sm text-error" role="alert">
                    {profileError}
                  </p>
                )}
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-0.5 mb-1">
                    <span className="text-xs text-base-content/70">
                      STUDENT ID
                    </span>
                    <span className="text-xs text-base-content/70">
                      CURRENT CLASS
                    </span>
                    <span className="text-xs text-base-content/70 md:ml-1">
                      DATE ENROLLED
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-sm">
                      {isProfileLoading
                        ? "Loading..."
                        : profile?.studentId || "Not available"}
                    </span>
                    <span className="text-sm">
                      {isProfileLoading
                        ? "Loading..."
                        : profile?.className || "Not assigned"}
                    </span>
                    <span className="text-sm md:ml-1">
                      {isProfileLoading
                        ? "Loading..."
                        : formatEnrollmentDate(profile?.enrollmentDate)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-base-content/70">
                      Class Teacher:{" "}
                      {isProfileLoading
                        ? "Loading..."
                        : profile?.classTeacher?.name || "Not assigned"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewDetail(!viewDetail)}
                      className="btn btn-outline btn-sm rounded-md"
                    >
                      {viewDetail ? "Close details" : "Show details"}
                    </button>
                  </div>
                  {viewDetail && (
                    <span>
                      <p>
                        <b>Tel: </b>
                        {profile?.classTeacher?.phoneNumber || "Not provided"}
                      </p>
                      <p>
                        <b>Email: </b>
                        {profile?.classTeacher?.email || "Not provided"}
                      </p>
                    </span>
                  )}
                </div>
              </div>
              <section
                aria-label="Academic and attendance summary"
                className="mt-5 flex shrink-0 items-center border-t border-base-300 pt-4 md:mt-0 md:border-l md:border-t-0 md:pl-6 md:pt-0"
              >
                <div className="pr-5 text-center">
                  <p className="text-xs font-medium text-base-content/70">
                    {dashboardMetrics.academicMetricLabel}
                  </p>
                  <p className="text-lg font-bold">
                    {metricsLoading
                      ? "..."
                      : dashboardMetrics.academicMetric === null
                        ? "N/A"
                        : dashboardMetrics.academicMetricLabel === "CGPA"
                          ? `${dashboardMetrics.academicMetric.toFixed(2)} / 5.00`
                          : dashboardMetrics.academicMetric}
                  </p>
                </div>
                <div className="border-l border-base-300 pl-5 text-center">
                  <p className="text-xs font-medium text-base-content/70">
                    Current Attendance
                  </p>
                  <p className="text-lg font-bold">
                    {metricsLoading
                      ? "..."
                      : dashboardMetrics.attendance === null
                        ? "N/A"
                        : `${dashboardMetrics.attendance}%`}
                  </p>
                </div>
              </section>
              {metricsError && (
                <p className="text-xs text-error md:max-w-48" role="alert">
                  {metricsError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {viewResult ? (
        selectedResult && (
          <ViewResult result={selectedResult} setViewResult={setViewResult} />
        )
      ) : (
        <ActivePage
          profile={profile}
          isLoading={isProfileLoading}
          error={profileError}
          setViewResult={setViewResult}
          setSelectedResult={setSelectedResult}
          viewResult={viewResult}
          onBack={() => {
            navigateBack();
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
