import {
  FaPlus,
  FaUserTie,
  FaUsers,
  FaCheckDouble,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import AdminStatus from "./AdminStatus";

const AdminContent = () => {
  return (
    <div className="pt-[82px]">
      <div className="px-4 py-8">
        <h1 className="text-xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            Academic year 2025/26 &middot; Term 2, Week 8
          </p>
          <button className="btn btn-primary rounded-lg">
            <FaPlus />
            New Report
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 items-stretch justify-between mt-4">
          <div className="card p-6 border-t-4 border-x-2 border-primary flex flex-col gap-2 flex-1 h-full">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-md bg-base-content/10">
                <FaUsers size={18} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                +2.4% <FaChartLine />
              </div>
            </div>
            <p className="text-xl text-base-content/70">TOTAL STUDENTS</p>
            <span className="text-2xl font-bold">1,200</span>
          </div>
          <div className="card p-6 border-t-4 border-x-2 border-primary flex flex-col gap-2 flex-1 h-full">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-md bg-base-content/10">
                <FaUserTie size={18} />
              </div>
              <div>Stable</div>
            </div>
            <p className="text-xl text-base-content/70">TOTAL STAFF</p>
            <span className="text-2xl font-bold">85</span>
          </div>
          <div className="card p-6 border-t-4 border-x-2 border-primary flex flex-col gap-2 flex-1 h-full">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-md bg-base-content/10">
                <FaCheckDouble size={18} />
              </div>
              <div className="text-green-600">On Target</div>
            </div>
            <p className="text-xl text-base-content/70 max-w-"> TODAY'S ATTENDANCE</p>
            <span className="text-2xl font-bold">94%</span>
          </div>
          <div className="card p-6 border-t-4 border-x-2 border-primary flex flex-col gap-2 flex-1 h-full">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-md bg-red-300">
                <FaExclamationTriangle size={18} className="text-red-600" />
              </div>
              <div className="text-red-600">Action Req.</div>
            </div>
            <p className="text-xl text-base-content/70">RECENT ALERTS</p>
            <span className="text-2xl font-bold">08</span>
          </div>
        </div>
        <AdminStatus/>
      </div>
    </div>
  );
};

export default AdminContent;
