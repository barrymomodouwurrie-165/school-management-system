import { FaDotCircle } from "react-icons/fa";
import dayjs from "dayjs";
import { useState } from "react";
import { useMemo } from "react";
import AttendanceRecordRow, { getStatus } from "./AttendanceRecordRow";

const STUDENTS_BY_CLASS = {
  "Grade 10 A": [
    { id: "001", name: "Fatoumatta Jobe" },
    { id: "002", name: "Bubacarr Jallow" },
    { id: "003", name: "Ousman Saine" },
    { id: "004", name: "Mariama Bah" },
    { id: "005", name: "Mustapha Colley" },
  ],
  "Grade 11 A": [
    { id: "101", name: "Isatou Ceesay" },
    { id: "102", name: "Lamin Darboe" },
    { id: "103", name: "Awa Touray" },
    { id: "104", name: "Modou Sowe" },
  ],
};


const getRecentSchoolDays = (count) => {
  const days = [];
  let cursor = dayjs().subtract(1, "day");
  while (days.length < count) {
    const dow = cursor.day();
    if (dow !== 0 && dow !== 6) days.push(cursor);
    cursor = cursor.subtract(1, "day");
  }
  return days;
};

const buildSampleSessions = (classroom) =>
  getRecentSchoolDays(7).map((day, n) => ({
    date: day.format("YYYY-MM-DD"),
    records: STUDENTS_BY_CLASS[classroom].map((student, i) => {
      const firstCall = (i + n + 1) % 5 !== 0;
      const secondCall = firstCall || (i + n + 1) % 3 === 0;
      return { ...student, firstCall, secondCall };
    }),
  }));

const SAMPLE_SESSIONS = Object.fromEntries(
  Object.keys(STUDENTS_BY_CLASS).map((c) => [c, buildSampleSessions(c)]),
);

const CheckStudentAttendance = () => {
  const classrooms = Object.keys(SAMPLE_SESSIONS);
  const [classroom, setClassroom] = useState(classrooms[0]);
  const [selectedDate, setSelectedDate] = useState(
    SAMPLE_SESSIONS[classrooms[0]][0].date,
  );

  const sessions = SAMPLE_SESSIONS[classroom];
  const session = sessions.find((s) => s.date === selectedDate);

  const summary = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0 };
    session?.records.forEach((r) => {
      counts[getStatus(r).toLowerCase()] += 1;
    });
    const total = session?.records.length ?? 0;
    const rate = total
      ? Math.round(((counts.present + counts.late) / total) * 100)
      : 0;
    return { ...counts, total, rate };
  }, [session]);
  const handleClassRoomChange = (e) => {
    const next = e.target.value;
    setClassroom(next);
    setSelectedDate(SAMPLE_SESSIONS[next][0].date);
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="rounded-md shadow-md px-2 pb-4">
        <p className="text-sm md:text-bas mb-2">ACADEMIC SESSION: 2025/26</p>
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-lg font-bold text-blue-600">
            View Attendance
          </h2>
          <div className="flex items-center gap-2 text-xs md:text-base bg-blue-600/10 px-2 py-1 rounded-xl">
            <span className="flex items-center text-green-600">
              <FaDotCircle />
              {summary.present} Present
            </span>
            <span className="flex items-center text-amber-600">
              <FaDotCircle />
              {summary.late} Late
            </span>
            <span className="flex items-center text-red-600">
              <FaDotCircle />
              {summary.absent} Absent
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-md shadow-md my-4 px-2 pb-4">
        <form action="">
          <div className="flex items-center gap-6  max-w-md">
            <div className="flex flex-col gap-2">
              <p className="text-base-content/70 text-xs md:text-base">
                CLASSROOM
              </p>
              <span className="bg-blue-600/5 rounded-md max-w-36">
                <select
                  onChange={handleClassRoomChange}
                  value={classroom}
                  className="select select-ghost select-sm rounded-md"
                  name=""
                  id=""
                >
                  {classrooms.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base-content/70 text-xs md:text-base">
                DATE OF SESSION
              </p>
              <span className="bg-blue-600/5 rounded-md max-w-36">
                <input
                  type="date"
                  className="input input-ghost input-sm rounded-md max-w-36"
                  max={dayjs().format("DD/MM/YYYY")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={selectedDate}
                  name=""
                  id=""
                />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base-content/70 text-xs md:text-base">
                ATTENDANCE RATE
              </p>
              <p className="text-blue-600 font-bold">
                {session ? `${summary.rate}%` : "-"}
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-2 my-3 text-xs md:text-sm">
        <span className="text-base-content/70">Recent sessions:</span>
        {sessions.map((s) => (
          <button
            key={s.date}
            onClick={() => setSelectedDate(s.date)}
            className={`px-2 py-1 rounded-xl ${
              s.date === selectedDate
                ? "bg-blue-600 text-white"
                : "bg-blue-600/10 hover:bg-blue-600/20"
            }`}
          >
            {dayjs(s.date).format("ddd DD/MM")}
          </button>
        ))}
      </div>
      <div className="my-4">
        {session ? (
          <>
            <div className="grid grid-cols-5 font-bold text-sm md:text-base px-2 mb-4">
              <p>ID</p>
              <p>Name</p>
              <p>First Call</p>
              <p>Second Call</p>
              <p>Status</p>
            </div>
            {session.records.map((data) => (
              <AttendanceRecordRow key={data.id} data={data} />
            ))}
            <p className="text-sm text-base-content/70">
              {summary.total} students on{" "}
              {dayjs(session.date).format("dddd, DD/MM/YYYY")}
            </p>
          </>
        ) : (
          <div className="rounded-md shadow-md p-6 text-center text-sm md:text-base">
            <p className="font-bold">No attendance saved for this date</p>
            <p className="text-base-content/70">
              Pick another date, or choose one of the recent sessions above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStudentAttendance;
