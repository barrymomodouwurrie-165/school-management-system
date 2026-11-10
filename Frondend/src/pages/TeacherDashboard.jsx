import TeacherSideBar from "../components/TeacherComponents/TeacherSideBar";
import TeacherSideBarNav from "../components/TeacherComponents/TeacherSideBarNav";
import Announcement from "../components/Announcement";
import TeacherProfilePage from "../components/TeacherComponents/TeacherProfilePage";
import MarkAttendance from "../components/TeacherComponents/MarkAttendance";
import ExamsContent from "../components/ExamsContent";
import EnterResults from "../components/TeacherComponents/EnterResults";
import TeacherRemarks from "../components/TeacherComponents/TeacherRemarks";
import ReportStudent from "../components/TeacherComponents/ReportStudent";
import SendSuggestion from "../components/TeacherComponents/SendSuggestion";
import CheckStudentAttendance from "../components/TeacherComponents/CheckStudentAttendance";
import MyStudents from "../components/TeacherComponents/MyStudents";
import MyClassSubjects from "../components/TeacherComponents/MyClassSubjects";
import StudentSuccessRadar from "../components/TeacherComponents/StudentSuccessRadar";
import { MdExitToApp } from "react-icons/md";
import { useEffect, useState } from "react";
import { getTeacherProfile } from "../utils/teacherApi";
import LogoutButton from "../components/LogoutButton";
import {
  FaArrowLeft,
  FaBullhorn,
  // FaChalkboardTeacher,
  // FaUserGraduate,
  FaClipboardCheck,
  FaPenAlt,
  FaFlag,
  FaChartLine,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

const TeacherDashboard = ({ theme, toggleTheme }) => {
  const [activePage, setActivePage] = useState("announcements");
  const [pageHistory, setPageHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTeacherProfile()
      .then((teacherProfile) => {
        if (active) setProfile(teacherProfile);
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

  const PAGES = {
    announcements: Announcement,
    profile: TeacherProfilePage,
    "mark-attendance": MarkAttendance,
    "view-attention": CheckStudentAttendance,
    "enter-results": EnterResults,
    "teacher-remarks": TeacherRemarks,
    "my-students": MyStudents,
    "success-radar": StudentSuccessRadar,
    "my-class-subjects": MyClassSubjects,
    "exam-details": ExamsContent,
    "report-student": ReportStudent,
    "send-suggestion": SendSuggestion,
  };
  const NAV_PAGES = [
    { id: "announcements", label: "Announcements", logo: FaBullhorn },
    // { id: "my-classes", label: "My Classes", logo: FaChalkboardTeacher },
    // { id: "students", label: "Students", logo: FaUserGraduate },
    {
      id: "attendance",
      label: "Attendance",
      logo: FaClipboardCheck,
      children: [
        { id: "mark-attendance", label: "Mark Attendance" },
        { id: "view-attention", label: "View Attendance" },
      ],
    },
    {
      id: "academics",
      label: "Academics",
      logo: FaPenAlt,
      children: [
        { id: "enter-results", label: "Enter Results" },
        { id: "teacher-remarks", label: "Teacher Remarks" },
        { id: "my-students", label: "My Students" },
        { id: "success-radar", label: "Student Success Radar", logo: FaChartLine },
        { id: "my-class-subjects", label: "My Class Subjects" },
        { id: "exam-details", label: "Exam Details" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      logo: FaFlag,
      children: [
        { id: "report-student", label: "Report Student" },
        { id: "send-suggestion", label: "Suggestion" },
      ],
    },
    { id: "profile", label: "My Profile", logo: FaUserCircle },
  ];
  const ActivePage = PAGES[activePage];
  const navigateToPage = (page) => {
    if (page !== activePage) {
      setPageHistory((history) => [...history, activePage]);
      setActivePage(page);
    }
    setOpen(false);
  };
  const navigateBack = () => {
    if (!pageHistory.length) {
      setOpen(true);
      return;
    }
    setActivePage(pageHistory[pageHistory.length - 1]);
    setPageHistory((history) => history.slice(0, -1));
    setOpen(false);
  };
  const activePageLabel = NAV_PAGES.flatMap((item) => [
    item,
    ...(item.children || []),
  ]).find((item) => item.id === activePage)?.label;
  return (
    <div
      className={`min-h-screen overflow-y-auto scrollbar-hide md:pl-[220px] ${
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
      <TeacherSideBar
        activePage={activePage}
        onNavigate={navigateToPage}
        NAV_PAGES={NAV_PAGES}
      />
      <nav
        aria-label="Mobile page navigation"
        className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 pt-3 md:hidden"
      >
        <button
          type="button"
          onClick={navigateBack}
          className="btn btn-ghost btn-sm"
          aria-label={pageHistory.length ? "Go back" : "Open menu"}
        >
          <FaArrowLeft />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold">
          {activePageLabel}
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
        <div className="mt-4 rounded-lg border-t-2 border-primary p-4 shadow-sm md:mt-0">
          {open ? (
            <div
              className="fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-blue-950 px-2 shadow-2xl shadow-slate-950/40 md:flex"
            >
              <div className="z-50 flex w-[210px] flex-shrink-0 items-start justify-between py-2 text-center">
                <div className="flex flex-1 flex-col items-center text-white">
                  <p className="font-bold text-xl">
                    Junior and Senior School Management
                  </p>
                  <p className="text-sm text-white/60">Teacher's Portal</p>
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
                  <TeacherSideBarNav
                    activePage={activePage}
                    onNavigate={navigateToPage}
                    NAV_PAGES={NAV_PAGES}
                    open={open}
                    setOpen={setOpen}
                    //   setIsClick={setIsClick}
                  />
                  <div>
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <h1 className="text-2xl font-bold text-blue-600">
                {isProfileLoading
                  ? "Loading your profile..."
                  : profile
                    ? `Welcome back, ${profile.fullName} (${profile.staffId})`
                    : "Welcome back"}
              </h1>
              {profileError && (
                <p className="mt-1 text-sm text-error" role="alert">
                  {profileError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {activePage === "profile" ? (
        <TeacherProfilePage
          profile={profile}
          isLoading={isProfileLoading}
          error={profileError}
        />
      ) : activePage === "exam-details" ? (
        <ExamsContent viewer="teacher" readOnly />
      ) : (
        <ActivePage />
      )}
    </div>
  );
};

export default TeacherDashboard;
