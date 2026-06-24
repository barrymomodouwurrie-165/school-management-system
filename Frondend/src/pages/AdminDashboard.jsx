import AdminSidebar from "../components/AdminSidebar"
import AdminNavebar from "../components/AdminNavebar"
import AdminContent from "../components/AdminContent"
const AdminDashboard = () => {
  return (
    <div className="min-h-screen pl-[220px]">
      <AdminSidebar />
      <AdminNavebar />
      <AdminContent/>
    </div>
  )
}

export default AdminDashboard
