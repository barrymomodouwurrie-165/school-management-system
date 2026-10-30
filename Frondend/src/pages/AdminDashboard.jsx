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
  FaUserTie,
  FaBookOpen,
  FaComments,
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaTachometerAlt,
  FaFlag,
  FaCalendarCheck,
} from "react-icons/fa";
import { getAdminProfile } from "../utils/adminApi";

const AdminDashboard = ({
  theme,
  toggleTheme,
}) => {
  const [activePage, setActivePage] = useState("admin");
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
        { id: "public-newscm-history-item:c%3A%5CUsers%5CMomodou%20Wurrie%20Barry%5CDesktop%5CSchool-Management-System?%7B%22repositoryId%22%3A%22scm0%22%2C%22historyItemId%22%3A%221fdfb0eecac2b04f54a7939e2e1176ad4470f7f8%22%2C%22historyItemParentId%22%3A%220919776cf15ce95fc6063bd9776f43307215c39f%22%2C%22historyItemDisplayId%22%3A%221fdfb0e%22%7Ds", label: "Compose News" },
        { id: "private-message", label: "Compose Message" },
      ],
    },
  ];
  const ActivePage = PAGES[activePage];
  return (
    <div
      className={`${
        isOpen ? "fixed inset-0 z-40 bg-black/50 md:hidden" : ""
      } min-h-screen md:pl-[220px] overflow-y-auto scrollbar-hide ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
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
                onNavigate={setActivePage}
                NAV_PAGES={NAV_PAGES}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setIsClick={setIsClick}
              />
              <div>
                <Link className=" btn btn-ghost ">
                  <FaSignOutAlt size={18} />
                  Logout
                </Link>
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
