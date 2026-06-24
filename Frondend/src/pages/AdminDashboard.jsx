import AdminSidebar from "../components/AdminSidebar"
import AdminNavebar from "../components/AdminNavebar"
const AdminDashboard = () => {
  return (
    <div className="min-h-screen pl-[220px]">
      <AdminSidebar />
      <AdminNavebar/>
    </div>
  )
}

export default AdminDashboard
