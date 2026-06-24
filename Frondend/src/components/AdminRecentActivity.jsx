import {
  FaUserPlus,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaChartBar,
} from "react-icons/fa"; 

const AdminRecentActivity = () => {
  return (
    <div className="max-w-xl px-4 py-4 border border-base-content/20 rounded-lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">Recent Activity</p>
          <button className="btn btn-outline btn-sm rounded-lg">
            View All
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-500/40 rounded-lg self-start">
            <FaUserPlus />
          </div>
          <div>
            <p className="text-blue-900 font-bold">New student registered:</p>
            <p>Mustapha Barrow(Grade 10S)</p>
            <p className="text-base-content/60">
              15 minutes ago &middot; Adm. Mr. Jarju
            </p>
          </div>
        </div>
        <div className="flex items-top gap-2">
          <div className="p-2 bg-slate-500/40 rounded-lg self-start">
            <FaClipboardCheck />
          </div>
          <div>
            <p className="text-blue-900 font-bold">Attendance marked:</p>
            <p>10A1 Morning Session</p>
            <p className="text-base-content/60">
              45 minutes ago &middot; Mr. Jallow
            </p>
          </div>
        </div>
        <div className="flex items-top gap-2">
          <div className="p-2 bg-red-600/40 text-red-600 rounded-lg self-start">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-red-600 font-bold">Unexpected Absence:</p>
            <p>Mr. Sowe</p>
            <p className="text-base-content/60">
              1 hour ago &middot; Automated System
            </p>
          </div>
        </div>
        <div className="flex items-top gap-2">
          <div className="p-2 bg-slate-500/40 rounded-lg self-start">
            <FaChartBar />
          </div>
          <div>
            <p className="text-blue-900 font-bold">Grades published:</p>
            <p>Mid-term Mathematics</p>
            <p className="text-base-content/60">
              3 hours ago &middot; Mr. Barry
            </p>
          </div>
        </div>
        <div className="flex items-top gap-2">
          <div className="p-2 bg-red-600/40 text-red-600 rounded-lg self-start">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-red-600 font-bold">Unexpected Absence:</p>
            <p>Mr. Samba</p>
            <p className="text-base-content/60">
              {" "}
              1 day ago &middot; Automated System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRecentActivity
