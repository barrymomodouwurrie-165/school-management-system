import AdminSidebar from "../components/AdminSidebar";
import AdminNavebar from "../components/AdminNavebar";
import AdminContent from "../components/AdminContent";
import { MdExitToApp } from "react-icons/md";
import profile from "../assets/profile.webp";
import { useState } from "react";
import { Link } from "react-router";
import {
  FaUserTie,
  FaBookOpen,
  FaClipboardCheck,
  FaComments,
  FaCog,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("admin");
  const [isOpen, setIsOpen] = useState(false);
  const PAGES = {
    admin: AdminContent,
    // students: StudentsContent,
    // staff: StaffContent,
    // academics: AcademicsContent,
    // attendance: AttendanceContent,
    // communication: CommunicationContent,
    // adminPage: AdminPage,
  };
  const NAV_PAGES = [
    { id: "admin", label: "Dashboard", logo: FaUsers },
    { id: "students", label: "Students", logo: FaUsers },
    { id: "staff", label: "Staff", logo: FaUserTie },
    { id: "academics", label: "Academics", logo: FaBookOpen },
    { id: "attendance", label: "Attendance", logo: FaClipboardCheck },
    { id: "communication", label: "Communication", logo: FaComments },
    { id: "adminPage", label: "Admin", logo: FaCog },
  ];
  const ActivePage = PAGES[activePage];
  return (
    <div className="min-h-screen md:pl-[220px] overflow-y-auto scrollbar-hide ">
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        NAV_PAGES={NAV_PAGES}
      />
      {isOpen ? (
        <div className="fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2 flex flex-col">
          <div className="z-50 w-[210px] py-2  text-center flex-shrink-0">
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
              <div>
                {NAV_PAGES &&
                  NAV_PAGES.map((page) => {
                    return (
                      <button
                        onClick={() => {
                          (setActivePage(page.id), setIsOpen(false));
                        }}
                        className={`btn btn-ghost ${activePage === page.id ? "btn-active" : ""}`}
                        key={page.id}
                      >
                        <page.logo size={18} />
                        {page.label}
                      </button>
                    );
                  })}
                <div>
                  <Link className=" btn btn-ghost ">
                    <FaSignOutAlt size={18} />
                    Logout
                  </Link>
                </div>
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
        <AdminNavebar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <ActivePage />
    </div>
  );
};

export default AdminDashboard;
