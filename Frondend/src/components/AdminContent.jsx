import { useEffect, useState } from "react";
import {
  FaCheckDouble,
  FaExclamationTriangle,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import AdminStatus from "./AdminStatus";
import AdminRecentActivity from "./AdminRecentActivity";
import { getAdminDashboardOverview } from "../utils/adminApi";
import { getAcademicPeriod } from "../utils/academicPeriod";

const AdminContent = ({ isOpen }) => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminDashboardOverview()
      .then((result) => {
        if (active) setOverview(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const academicPeriod = getAcademicPeriod();
  const stats = overview?.stats;
  const cards = [
    {
      label: "TOTAL STUDENTS",
      value: stats?.totalStudents,
      note: "Active and suspended",
      maleLabel: "Male students",
      maleCount: stats?.maleStudents,
      femaleLabel: "Female students",
      femaleCount: stats?.femaleStudents,
      icon: FaUsers,
      bg: "bg-primary/10",
    },
    {
      label: "TOTAL STAFF",
      value: stats?.totalStaff,
      note: "Currently enrolled staff",
      maleLabel: "Male staff",
      maleCount: stats?.maleStaff,
      femaleLabel: "Female staff",
      femaleCount: stats?.femaleStaff,
      icon: FaUserTie,
      bg: "bg-blue-100",
    },
    {
      label: "TODAY'S ATTENDANCE",
      value:
        stats?.attendancePercentage == null
          ? "—"
          : `${stats.attendancePercentage}%`,
      note:
        stats?.totalClasses > 0
          ? `${stats.completedClasses} of ${stats.totalClasses} class registers completed`
          : "No active classes configured",
      icon: FaCheckDouble,
      bg: "bg-green-100",
    },
    {
      label: "RECENT ALERTS",
      value: overview?.recentActivities?.length ?? 0,
      note: "Staff and student activity today",
      icon: FaExclamationTriangle,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className={`${isOpen ? "" : "pt-[82px]"} mt-4`}>
      <div className={`${isOpen ? "px-4 py-2" : "px-4 py-8"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold font-sans">DASHBOARD OVERVIEW</h1>
          <p className="text-sm text-base-content/70">
            Academic year             {academicPeriod.academicYear} &middot;{" "}
            {academicPeriod.periodLabel}
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className="rounded-[1.5rem] border-t-2 border-primary bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {isLoading ? "Loading" : "Today"}
                  </span>
                </div>
                <p className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                  {item.label}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-3xl font-black text-slate-800">
                      {isLoading ? "—" : (item.value ?? "—")}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                  </div>
                  {item.maleLabel && (
                    <div className="grid w-[55%] shrink-0 grid-cols-2 gap-2 border-l border-slate-200 pl-3 text-center">
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-500">
                          Male
                        </p>
                        <p className="text-3xl font-black text-slate-800">
                          {isLoading ? "—" : (item.maleCount ?? "—")}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-500">
                          Female
                        </p>
                        <p className="text-3xl font-black text-slate-800">
                          {isLoading ? "—" : (item.femaleCount ?? "—")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <AdminStatus
          facultyStatus={overview?.facultyStatus ?? []}
          headOfBlocks={overview?.headOfBlocks ?? []}
          isLoading={isLoading}
        />
        <AdminRecentActivity
          activities={overview?.recentActivities ?? []}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default AdminContent;
