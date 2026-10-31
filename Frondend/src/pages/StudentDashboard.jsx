import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
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
import { getStudentProfile } from "../utils/studentApi";
import LogoutButton from "../components/LogoutButton";

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
  const [open, setOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentProfile()
      .then((studentProfile) => {
        if (active) setProfile(studentProfile);
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
    classmates: Classmates,
    attendance: Attendance,
    ai: AiAssistance,
    "check-result": ResultCheck,
    "exam-details": ExamsContent,
    "report-student": ReportStudent,
    suggestion: SendSuggestion,
    complaint: SendComplaint,
    profile: StudentProfilePage,
  };

  const ActivePage = PAGES[activePage] && PAGES[activePage];

  const NAV_ITEMS = [
    { id: "announcements", label: "Announcements", icon: FaBullhorn },
    { id: "classmates", label: "Classmates", icon: FaUsers },
    { id: "attendance", label: "Attendance", icon: FaClipboardCheck },
    {
      id: "exams",
      label: "Exams",
      icon: FaFileAlt,
      children: [
        { id: "check-result", label: "Check Result" },
        { id: "exam-details", label: "Check Exam Details" },
      ],
    },
    { id: "ai", label: "AiAssistance", icon: FaRobot },
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
      className={`${
        open ? "fixed inset-0 z-40 bg-black/50 md:hidden" : ""
      } min-h-screen md:pl-[220px] py-4 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <StudentSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        NAV_ITEMS={NAV_ITEMS}
        viewResult={viewResult}
        setViewResult={setViewResult}
        profile={profile}
      />
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-end">
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
                  <p className="text-sm text-white/60">Student Portal</p>
                </div>
              </div>
              <div className=" flex-1 overflow-y-auto [scrollbar-width:none] p-2 text-white/60 mt-2">
                <div className="flex flex-col pl-2">
                  <SideBarNav
                    NAV_ITEMS={NAV_ITEMS}
                    activePage={activePage}
                    onNavigate={setActivePage}
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
            <div className="md:flex items-center justify-between">
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
                  <div className="grid grid-cols-3 ">
                    <span className="text-xs text-base-content/70">
                      STUDENT ID
                    </span>
                    <span className="text-xs text-base-content/70">
                      CURRENT CLASS
                    </span>
                    <span className="text-xs text-base-content/70">
                      DATE ENROLLED
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-sm">
                      {isProfileLoading ? "Loading..." : profile?.studentId || "Not available"}
                    </span>
                    <span className="text-sm">
                      {isProfileLoading ? "Loading..." : profile?.className || "Not assigned"}
                    </span>
                    <span className="text-sm">
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
            </div>
          )}
        </div>
      </div>
      {viewResult ? (
        <ViewResult viewResult={viewResult} setViewResult={setViewResult} />
      ) : (
        <ActivePage
          profile={profile}
          isLoading={isProfileLoading}
          error={profileError}
          setViewResult={setViewResult}
          viewResult={viewResult}
          onBack={() => {
            setActivePage("announcements");
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
