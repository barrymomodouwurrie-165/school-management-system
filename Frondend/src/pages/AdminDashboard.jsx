import AdminSidebar from "../components/AdminSidebar";
import AdminNavebar from "../components/AdminNavebar";
import AdminContent from "../components/AdminContent";
import AdminSidebarNav from "../components/AdminSidebarNav";
import RegisterStaff from "../components/RegisterStaff";
import RegisterStudent from "../components/RegisterStudent";
import StudentsContent from "../components/StudentsContent";
import StaffContent from "../components/StaffContent";
import AcademicsContent from "../components/AcademicsContent";
import AdminSubmissions from "../components/AdminSubmissions";
import CommunicationsContent from "../components/CommunicationsContent";
import NewsComposePage from "../components/NewsComposePage";
import AdminAttendance from "../components/AdminAttendance";
import AdminProfile from "../components/AdminProfile";
import AsignStaffRole from "../components/AsignStaffRole";
import { MdExitToApp } from "react-icons/md";
import profile from "../assets/profile.webp";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaArrowLeft,
  FaBars,
  FaUserTie,
  FaBookOpen,
  FaComments,
  FaCog,
  FaUsers,
  FaTachometerAlt,
  FaFlag,
  FaCalendarCheck,
} from "react-icons/fa";
import { getAdminProfile } from "../utils/adminApi";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = ({
  theme,
  toggleTheme,
}) => {
  const [activePage, setActivePage] = useState("admin");
  const [pageHistory, setPageHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [assign, setAssign] = useState(false);
  const [staffName, setStaffName] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileRefresh, setProfileRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    getAdminProfile()
      .then((profile) => {
        if (active) setAdminProfile(profile);
      })
      .catch((error) => {
        if (active) setProfileError(error.message);
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profileRefresh]);

  const PAGES = {
    admin: AdminContent,
    "admin-profile": AdminProfile,
    "register-staff": RegisterStaff,
    "register-student": RegisterStudent,
    students: StudentsContent,
    staff: StaffContent,
    academics: AcademicsContent,
    submissions: AdminSubmissions,
    "private-message": CommunicationsContent,
    "public-news": NewsComposePage,
    attendance: AdminAttendance,
  };
  const NAV_PAGES = [
    { id: "admin", label: "Dashboard", logo: FaTachometerAlt },
    {
      id: "adminPage",
      label: "Admin",
      logo: FaCog,
      children: [
        { id: "admin-profile", label: "Admin Profile" },
        { id: "register-staff", label: "Register Staff" },
        { id: "register-student", label: "Register Student" },
      ],
    },
    { id: "students", label: "Students", logo: FaUsers },
    { id: "staff", label: "Staff", logo: FaUserTie },
    { id: "academics", label: "Academics", logo: FaBookOpen },
    { id: "submissions", label: "Submissions", logo: FaFlag },
    { id: "attendance", label: "Attendance", logo: FaCalendarCheck },

    {
      id: "message",
      label: "Message",
      logo: FaComments,
      children: [
        { id: "public-news", label: "Compose News" },
        { id: "private-message", label: "Compose Message" },
      ],
    },
  ];
  const ActivePage = PAGES[activePage];
  const navigateToPage = (page) => {
    if (page !== activePage) {
      setPageHistory((history) => [...history, activePage]);
      setActivePage(page);
    }
    setIsClick(page !== "admin");
    setIsOpen(false);
  };
  const navigateBack = () => {
    if (!pageHistory.length) {
      setIsOpen(true);
      return;
    }
    const previousPage = pageHistory[pageHistory.length - 1];
    setActivePage(previousPage);
    setPageHistory((history) => history.slice(0, -1));
    setIsClick(previousPage !== "admin");
    setIsOpen(false);
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
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <AdminSidebar
        activePage={activePage}
        onNavigate={navigateToPage}
        NAV_PAGES={NAV_PAGES}
        setIsClick={setIsClick}
        theme={theme}
        toggleTheme={toggleTheme}
        adminProfile={adminProfile}
      />

      {isOpen ? (
        <div className="fixed left-0 top-0 bottom-0 z-50 bg-blue-950 w-[220px] px-2 flex flex-col">
          <div className="w-[210px] py-2  text-center flex-shrink-0">
            <div className="flex flex-col items-center text-white">
              <p className="font-bold text-xl">
                Junior and Senior School Management
              </p>
              <p className="text-sm text-white/60">Aministration Portal</p>
              <Link
                className="md:hidden btn btn-ghost"
                onClick={() => setIsOpen(!isOpen)}
              >
                <MdExitToApp size={24} />{" "}
              </Link>
            </div>
          </div>
          <div className=" flex-1 overflow-y-auto [scrollbar-width:none] p-2 text-white/60 mt-2">
            <div className="flex flex-col pl-2">
              <AdminSidebarNav
                activePage={activePage}
                onNavigate={navigateToPage}
                NAV_PAGES={NAV_PAGES}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setIsClick={setIsClick}
              />
              <div>
                <LogoutButton />
              </div>
            </div>
            <div className=" z-50 w-[210px] py-4 border-t border-base-content/70 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className="p-2">
                  <img
                    src={adminProfile?.profilePicture || profile}
                    alt="Admin profile"
                    className="h-[40px] w-[40px] rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-white">
                    {adminProfile?.fullName || adminProfile?.username || "Admin"}
                  </h2>
                  <p className="text-white/60">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminNavebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isClick={isClick}
          theme={theme}
          toggleTheme={toggleTheme}
          adminProfile={adminProfile}
        />
      )}

      {isClick && (
        <nav
          aria-label="Mobile page navigation"
          className="flex items-center justify-between gap-2 px-4 pt-3 md:hidden"
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
            onClick={() => setIsOpen(true)}
            className="btn btn-outline btn-sm"
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
          >
            <FaBars />
            Menu
          </button>
        </nav>
      )}

      {assign ? (
        <AsignStaffRole
          assign={assign}
          setAssign={setAssign}
          staffName={staffName}
          staffId={staffId}
        />
      ) : (
        <ActivePage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          assign={assign}
          setAssign={setAssign}
          staffName={staffName}
          setStaffName={setStaffName}
          setStaffId={setStaffId}
          profile={adminProfile}
          isLoading={profileLoading}
          loadError={profileError}
          onRetry={() => {
            setProfileLoading(true);
            setProfileError("");
            setProfileRefresh((current) => current + 1);
          }}
          onProfileUpdated={(updatedProfile) => {
            setAdminProfile(updatedProfile);
            setProfileError("");
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
