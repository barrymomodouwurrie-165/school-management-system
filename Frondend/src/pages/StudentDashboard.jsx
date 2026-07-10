import StudentSidebar from "../components/StudentSidebar";
import { FaPen } from "react-icons/fa";
const StudentDashboard = () => {
  return (
    <div className="min-h-screen pl-[220px] py-4">
      <StudentSidebar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="p-2 grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_auto] border-t-2 border-primary rounded-lg shadow-sm">
          <div className=" w-[50px] h-[50px] flex items-center justify-center bg-blue-950/70 rounded-lg text-white font-bold">
            KS
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Welcome Back, Kebba Samba</h1>
            <button className="btn btn-primary btn-xs max-w-28">
              <FaPen />
              Edit Profile
            </button>
            <div className="flex flex-col">
              <div className="grid grid-cols-3 ">
                <span className="text-xs text-base-content/70">STUDENT ID</span>
                <span className="text-xs text-base-content/70">
                  CURRENT CLASS
                </span>
                <span className="text-xs text-base-content/70">
                  DATE ENROLLED
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-sm">2024001</span>
                <span className="text-sm">10 Science One</span>
                <span className="text-sm">Sept 12, 2024</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col border-l border-base-content/50 p-4">
              <span className="text-xl font-bold">3.88</span>
              <span className="text-xs text-base-content/70">CURRENT GPA</span>
            </div>
            <div className="flex flex-col border-l border-base-content/50 p-4">
              <span className="text-xl font-bold">94%</span>
              <span className="text-xs text-base-content/70">ATTENDANCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
