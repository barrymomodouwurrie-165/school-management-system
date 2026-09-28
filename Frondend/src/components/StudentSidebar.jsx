import profile from "../assets/profile.webp";
import { FaSignOutAlt } from "react-icons/fa";
import SideBarNav from "./StudentSideBarComponents/SideBarNav";

const StudentSidebar = ({ activePage, onNavigate, NAV_ITEMS }) => {
  return (
    <div
      className={`md:flex flex-col hidden fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2`}
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
            onNavigate={onNavigate}
          />
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
