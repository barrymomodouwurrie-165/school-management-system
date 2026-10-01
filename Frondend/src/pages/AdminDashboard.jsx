import AdminSidebar from "../components/AdminSidebar";
import AdminNavebar from "../components/AdminNavebar";
import AdminContent from "../components/AdminContent";
import AdminSidebarNav from "../components/AdminSidebarNav";
import RegisterStaff from "../components/RegisterStaff";
import RegisterStudent from "../components/RegisterStudent";
import StudentsContent from "../components/StudentsContent";
import StaffContent from "../components/StaffContent";
import AcademicsContent from "../components/AcademicsContent";
import CommunicationsContent from "../components/CommunicationsContent";
import { MdExitToApp } from "react-icons/md";
import profile from "../assets/profile.webp";
import { useState } from "react";
import { Link } from "react-router";
import {
  FaUserTie,
  FaBookOpen,
  FaComments,
  FaCog,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("admin");
  const [isOpen, setIsOpen] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const PAGES = {
    admin: AdminContent,
    "register-staff": RegisterStaff,
    "register-student": RegisterStudent,
    students: StudentsContent,
    staff: StaffContent,
    academics: AcademicsContent,
    communication: CommunicationsContent,
  };
  const NAV_PAGES = [
    { id: "admin", label: "Dashboard", logo: FaUsers },
    {
      id: "adminPage",
      label: "Admin",
      logo: FaCog,
      children: [
        { id: "register-staff", label: "Register Staff" },
        { id: "register-student", label: "Register Student" },
      ],
    },
    { id: "students", label: "Students", logo: FaUsers },
    { id: "staff", label: "Staff", logo: FaUserTie },
    { id: "academics", label: "Academics", logo: FaBookOpen },

    { id: "communication", label: "Communication", logo: FaComments },
  ];
  const ActivePage = PAGES[activePage];
  return (
    <div
      className={`${isOpen ? "fixed inset-0 z-40 bg-black/50 md:hidden" : ""} min-h-screen md:pl-[220px] overflow-y-auto scrollbar-hide `}
    >
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        NAV_PAGES={NAV_PAGES}
        setIsClick={setIsClick}
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
                    src={profile}
                    alt=""
                    className="w-[40px] h-[40px] rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-white">Dr. M. W. Barry</h2>
                  <p className="text-white/60">Principal Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminNavebar isOpen={isOpen} setIsOpen={setIsOpen} isClick={isClick} />
      )}
      <ActivePage isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AdminDashboard;
