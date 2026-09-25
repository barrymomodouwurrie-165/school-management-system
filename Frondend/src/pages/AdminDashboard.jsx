import AdminSidebar from "../components/AdminSidebar";
import AdminNavebar from "../components/AdminNavebar";
import AdminContent from "../components/AdminContent";
import { useState } from "react";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("admin");
  const PAGES = {
    admin: AdminContent,
    // students: StudentsContent,
    // staff: StaffContent,
    // academics: AcademicsContent,
    // attendance: AttendanceContent,
    // communication: CommunicationContent,
    // adminPage: AdminPage,
  };
  const ActivePage = PAGES[activePage];
  return (
    <div className="min-h-screen md:pl-[220px] overflow-y-auto scrollbar-hide ">
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />
      <AdminNavebar />
      <ActivePage />
    </div>
  );
};

export default AdminDashboard;
