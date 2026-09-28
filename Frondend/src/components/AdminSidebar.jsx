import { Link } from "react-router";
import profile from "../assets/profile.webp";
import { FaSignOutAlt } from "react-icons/fa";
import AdminSidebarNav from "./AdminSidebarNav";

const AdminSidebar = ({ activePage, onNavigate, NAV_PAGES }) => {
  return (
    <div className="hidden fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2 md:flex flex-col">
      <div className="z-50 w-[210px] py-2  text-center flex-shrink-0">
        <div className="flex flex-col items-center text-white">
          <p className="font-bold text-xl">
            Junior and Senior School Management
          </p>
          <p className="text-sm text-white/60">Aministration Portal</p>
        </div>
      </div>
      <div className=" flex-1 overflow-y-auto [scrollbar-width:none] p-2 text-white/60 mt-2">
        <div className="flex flex-col pl-2">
          <AdminSidebarNav
            activePage={activePage}
            onNavigate={onNavigate}
            NAV_PAGES={NAV_PAGES}
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
  );
};

export default AdminSidebar;
