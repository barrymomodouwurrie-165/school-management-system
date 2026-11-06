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
import { Link } from "react-router";
import { getTeacherProfile } from "../utils/teacherApi";
import LogoutButton from "../components/LogoutButton";
import {
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
  return (
    <div
      className={`${
        open ? "fixed inset-0 z-40 bg-black/50 md:hidden" : ""
      } min-h-screen md:pl-[220px] overflow-y-auto scrollbar-hide ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <TeacherSideBar
        activePage={activePage}
        onNavigate={setActivePage}
        NAV_PAGES={NAV_PAGES}
      />
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
        <div className="p-4 border-t-2 border-primary rounded-lg shadow-sm">
          <div className="flex items-center justify-end">
            <Link
              className="md:hidden btn btn-ghost"
              onClick={() => setOpen(!open)}
            >
              {open ? <MdExitToApp size={24} /> : <FaBars size={24} />}
            </Link>
          </div>

          {open ? (
            <div
              className={`md:flex flex-col fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2`}
            >
              <div className="z-50 w-[210px] py-2  text-center flex-shrink-0">
                <div className="flex flex-col items-center text-white">
                  <p className="font-bold text-xl">
                    Junior and Senior School Management
                  </p>
                  <p className="text-sm text-white/60">Teacher's Portal</p>
                </div>
              </div>
              <div className=" flex-1 overflow-y-auto [scrollbar-width:none] p-2 text-white/60 mt-2">
                <div className="flex flex-col pl-2">
                  <TeacherSideBarNav
                    activePage={activePage}
                    onNavigate={setActivePage}
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
