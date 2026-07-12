import profile from "../assets/profile.webp";
import { MdGrade } from "react-icons/md";
import {
  FaBullhorn,
  FaClipboardCheck,
  FaFileAlt,
  FaBook,
  FaRobot,
  FaFlag,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentSidebar = ({ activePage, onNavigate }) => {
  const NAV_ITEMS = [
    { id: "announcements", label: "Announcements", icon: FaBullhorn },
    { id: "results", label: "Results", icon: MdGrade },
    { id: "classmates", label: "Classmates", icon: FaUsers },
    { id: "attendance", label: "Attendance", icon: FaClipboardCheck },
    { id: "exams", label: "Exams", icon: FaFileAlt },
    { id: "library", label: "Library", icon: FaBook },
    { id: "ai", label: "AI assistance", icon: FaRobot },
    { id: "reports", label: "Reports", icon: FaFlag },
  ];
  return (
    <div className="fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2 flex flex-col">
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
          {NAV_ITEMS &&
            NAV_ITEMS.map((item) => {
              return (
                <div>
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`btn btn-ghost ${activePage === item.id ? "btn-active" : ""}`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                </div>
              );
            })}
          <div>
            <button className=" btn btn-ghost ">
              <FaSignOutAlt size={18} />
              Logout
            </button>
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
            <h2 className="font-bold text-white">Kebba Samba</h2>
            <p className="text-white/60">Grade 10 Science 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
