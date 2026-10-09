import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import "./App.css";
import { useState } from "react";
import admission from "./assets/admission.avif";
import athletic from "./assets/athletic.jpg";
import exam from "./assets/exam.jpg";
import graduation from "./assets/graduation.avif";

function App() {
  const [latestNews, setLatestNews] = useState([
    {
      id: "1",
      image: admission,
      headline:
        "🎓 Admissions Open for the 2026/2027 Academic Year at Bright Future Academy",
      news: "Bright Future Academy is pleased to announce that admissions for the 2026/2027 academic year are now open. Applications are invited for Kindergarten, Primary, and Junior High School levels. Interested parents and guardians are encouraged to obtain admission forms from the school office before the application deadline.",
      date: "June 18, 2026",
    },
    {
      id: "2",
      image: athletic,
      headline: "📝 Grade 9 Mock Examinations to Commence Next Week",
      news: "The school administration wishes to inform all Grade 9 students that the mock examinations will commence next week. Students are encouraged to complete their revisions, adhere to examination regulations, and arrive punctually for each paper. The mock exams are designed to prepare candidates for their final assessments.",
      date: "June 10, 2026",
    },
    {
      id: "3",
      image: exam,
      headline: "🏆 Annual Inter-House Sports Day Announced",
      news: "The school is excited to announce that the Annual Inter-House Sports Day will be held later this month. Student from all houses will compete in various track and field events. Parents and guardians are warmly invited to attend and support participants as they showcase their talents and sportsmanship.",
      date: "June 3, 2026",
    },
    {
      id: "4",
      image: graduation,
      headline: "🎓 Grade 12 Graduation Ceremony Announced",
      news: "The school proudly announces that the Grade 12 Graduation Ceremony will be held next month to celebrate the achievements of the graduating class. Students, parents, staff, and invited guests are encouraged to attend this memorable occasion as graduates mark the successful completion of their secondary education journey.",
      date: "May 15, 2026",
    },
  ]);
  const [messages, setMessages] = useState([
    {
      id: "1",
      send_from: "Admin",
      send_to: "Guardians",
      subject: "Parent meeting for the junior school",
      text: "Please join us on Friday 4 pm to discuss term progress.",
      date: "Sep 24",
    },
    {
      id: "2",
      send_from: "Admin",
      send_to: "All",
      subject: "School closed on public holiday",
      text: "School will be closed on Monday and will reopen on Tuesday.",
      date: "Sep 20",
    },
    {
      id: "3",
      send_from: "Admin",
      send_to: "Staff",
      subject: "Staff briefing before first period",
      text: "A short briefing will be held in the hall before first period on Wednesday.",
      date: "Sep 18",
    },
  ]);
  return (
    <div data-theme="corporate" className="bg-base-content/5">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              latestNews={latestNews}
              setLatestNews={setLatestNews}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminDashboard
              latestNews={latestNews}
              setLatestNews={setLatestNews}
              messages={messages}
              setMessages={setMessages}
            />
          }
        />
        <Route
          path="/student-portal"
          element={
            <StudentDashboard messages={messages} setMessages={setMessages} />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <TeacherDashboard messages={messages} setMessages={setMessages} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
