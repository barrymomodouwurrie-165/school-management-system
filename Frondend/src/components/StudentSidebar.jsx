import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import SideBarNav from "./StudentSideBarComponents/SideBarNav";

const StudentSidebar = ({
  activePage,
  onNavigate,
  NAV_ITEMS,
  viewResult,
  setViewResult,
  profile,
}) => {
  const initials = profile?.fullName
    ? profile.fullName
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "";

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
            viewResult={viewResult}
            setViewResult={setViewResult}
          />
          <div>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className=" z-50 w-[210px] py-4 border-t border-base-content/70 flex-shrink-0">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className={`flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-white/10 ${
            activePage === "profile" ? "bg-white/10" : ""
          }`}
          aria-label="Open student profile"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-700 text-sm font-bold text-white">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : initials ? (
              initials
            ) : (
              <FaUserCircle aria-hidden="true" size={32} />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-bold text-white">
              {profile?.fullName || "Student"}
            </h2>
            <p className="truncate text-sm text-white/60">
              {profile?.className || "Class not assigned"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
