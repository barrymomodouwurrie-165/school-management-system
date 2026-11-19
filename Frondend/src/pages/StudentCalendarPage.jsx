import { useEffect, useState } from "react";
import UpcomingSchoolEvents from "../components/UpcomingSchoolEvents";
import {
  getStudentCalendarEvents,
  getStudentExams,
} from "../utils/studentApi";

const toDateKey = (value) => String(value || "").slice(0, 10);

const StudentCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getStudentCalendarEvents(), getStudentExams()])
      .then(([schoolEvents, exams]) => {
        if (!active) return;
        const today = new Date().toISOString().slice(0, 10);
        const examEvents = exams
          .filter((exam) => toDateKey(exam.endDate) >= today)
          .map((exam) => ({
            ...exam,
            id: `exam-${exam._id}`,
            type: "exam",
            description: `${exam.section} examination`,
          }));
        setEvents(
          [...schoolEvents, ...examEvents].sort(
            (first, second) =>
              toDateKey(first.startDate).localeCompare(
                toDateKey(second.startDate),
              ) || first.title.localeCompare(second.title),
          ),
        );
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message || "Unable to load the school calendar.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-bold">School calendar</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Term dates, school events, and exam schedules for your section.
        </p>
      </header>
      <UpcomingSchoolEvents
        events={events}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
};

export default StudentCalendarPage;
