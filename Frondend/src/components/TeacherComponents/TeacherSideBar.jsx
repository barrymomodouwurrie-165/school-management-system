import { Link } from "react-router";
import { FaSignOutAlt } from "react-icons/fa";
import TeacherSideBarNav from "./TeacherSideBarNav";

const TeacherSideBar = ({ activePage, onNavigate, NAV_PAGES, setIsClick }) => {
  return (
    <div className="hidden fixed left-0 top-0 bottom-0 bg-blue-950 w-[220px] px-2 md:flex flex-col">
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
            onNavigate={onNavigate}
            NAV_PAGES={NAV_PAGES}
            setIsClick={setIsClick}
          />
          <div>
            <Link className=" btn btn-ghost ">
              <FaSignOutAlt size={18} />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSideBar;
