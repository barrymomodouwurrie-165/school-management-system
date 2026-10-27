import {
  FaPlus,
  FaUserTie,
  FaUsers,
  FaCheckDouble,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import AdminStatus from "./AdminStatus";
import AdminRecentActivity from "./AdminRecentActivity";

const AdminContent = ({ isOpen }) => {
  return (
    <div className={`${isOpen ? "" : "pt-[82px]"}`}>
      <div className={`${isOpen ? "px-4 py-2" : "px-4 py-8"}`}>
        <h1 className="text-l md:text-xl font-bold font-sans">
          DASHBOARD OVERVIEW
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            Academic year 2025/26 &middot; Term 2, Week 8
          </p>
          <button className="btn btn-primary rounded-lg btn-sm">
            <FaPlus />
            New Report
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "TOTAL STUDENTS",
              value: "1,200",
              trend: "+2.4%",
              tone: "green",
              icon: FaUsers,
              bg: "bg-primary/10",
            },
            {
              label: "TOTAL STAFF",
              value: "85",
              trend: "Stable",
              tone: "blue",
              icon: FaUserTie,
              bg: "bg-blue-100",
            },
            {
              label: "TODAY'S ATTENDANCE",
              value: "94%",
              trend: "On Target",
              tone: "green",
              icon: FaCheckDouble,
              bg: "bg-green-100",
            },
            {
              label: "RECENT ALERTS",
              value: "08",
              trend: "Action Req.",
              tone: "red",
              icon: FaExclamationTriangle,
              bg: "bg-red-100",
            },
          ].map((item) => {
            const Icon = item.icon;
            const toneClasses = {
              green: "text-green-600",
              blue: "text-primary",
              red: "text-red-600",
            };

            return (
              <div
                key={item.label}
                className="group rounded-[1.5rem] border-t-2 border-primary bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(37,99,235,0.12)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div
                    className={`text-xs font-semibold ${toneClasses[item.tone]}`}
                  >
                    {item.trend}
                    {item.label === "TOTAL STUDENTS" && (
                      <FaChartLine className="ml-1 inline" />
                    )}
                  </div>
                </div>

                <p className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                  {item.label}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-black text-slate-800">
                    {item.value}
                  </span>
                  <span className="rounded-full bg-primary/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Live
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <AdminStatus />
        <AdminRecentActivity />
      </div>
    </div>
  );
};

export default AdminContent;
