import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";


function App() {
  return (
    <div data-theme="corporate" className="bg-base-content/5">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-portal" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
