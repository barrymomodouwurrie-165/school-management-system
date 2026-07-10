import { Link } from "react-router";
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

const StudentSidebar = () => {
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
          <div>
            <div>
              <Link className=" btn btn-ghost btn-active">
                <FaBullhorn size={18} />
                Announcements
              </Link>
            </div>
            <div>
              <Link className=" btn btn-ghost">
                <MdGrade size={18} />
                Results
              </Link>
            </div>
            <Link className=" btn btn-ghost ">
              <FaUsers size={18} />
              Classmates
            </Link>
          </div>
          <div>
            <Link className=" btn btn-ghost ">
              <FaClipboardCheck size={18} />
              Attendance
            </Link>
          </div>
          <div>
            <Link className=" btn btn-ghost ">
              <FaFileAlt size={18} />
              Exams
            </Link>
          </div>
          <div>
            <Link className=" btn btn-ghost ">
              <FaBook size={18} />
              Library
            </Link>
          </div>
          <div>
            <Link className=" btn btn-ghost ">
              <FaRobot size={18} />
              AI assistance
            </Link>
          </div>
          <div>
            <Link className=" btn btn-ghost ">
              <FaFlag size={18} />
              reports
            </Link>
          </div>
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
            <h2 className="font-bold text-white">Kebba Samba</h2>
            <p className="text-white/60">Grade 10 Science 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
