import { Routes, Route, useNavigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import GuardianDashboard from "./pages/GuardianDashboard";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("school-theme");
    return savedTheme || "corporate";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("school-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleSessionExpired = () => navigate("/login", { replace: true });
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [navigate]);

  const toggleTheme = () => {
    setTheme((current) => (current === "corporate" ? "dark" : "corporate"));
  };

  return (
    <div data-theme={theme} className="bg-base-content/5 min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage theme={theme} toggleTheme={toggleTheme} />
          }
        />
        <Route
          path="/login"
          element={<LoginPage theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminDashboard
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="/student-portal"
          element={
            <StudentDashboard
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <TeacherDashboard
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="/guardian-portal"
          element={
            <GuardianDashboard
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
