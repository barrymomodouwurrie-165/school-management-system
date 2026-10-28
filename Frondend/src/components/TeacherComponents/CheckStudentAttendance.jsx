import { useEffect, useMemo, useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import dayjs from "dayjs";
import AttendanceRecordRow from "./AttendanceRecordRow";
import {
  getClassAttendanceSessions,
  getTeacherAttendanceClasses,
} from "../../utils/attendanceApi";

const CheckStudentAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [classId, setClassId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  const classroom = classrooms.find((item) => item._id === classId);
  const session =
    sessions.find(
      (item) => dayjs(item.date).format("YYYY-MM-DD") === selectedDate,
    ) || null;

  const summary = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0 };
    session?.entries.forEach((entry) => {
      const state = entry.firstCall
        ? "present"
        : entry.secondCall
          ? "late"
          : "absent";
      counts[state] += 1;
    });
    const total = session?.entries.length ?? 0;
    const rate = total
      ? Math.round(((counts.present + counts.late) / total) * 100)
      : 0;
    return { ...counts, total, rate };
  }, [session]);

  useEffect(() => {
    let active = true;
    getTeacherAttendanceClasses()
      .then((result) => {
        if (active) {
          setClassrooms(result);
          setClassId(result[0]?._id ?? "");
          if (!result.length) {
            setStatus("No active classes are assigned to your account.");
            setIsLoading(false);
          }
        }
      })
      .catch((error) => {
        if (active) {
          setStatus(error.message || "Unable to load your classes.");
          setIsLoading(false);
        }
      })

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!classId) return undefined;
    let active = true;
    getClassAttendanceSessions(classId)
      .then((result) => {
        if (active) {
          setSessions(result);
          if (result.length) {
            const latestDate = dayjs(result[0].date).format("YYYY-MM-DD");
            setSelectedDate((currentDate) =>
              result.some(
                (item) =>
                  dayjs(item.date).format("YYYY-MM-DD") === currentDate,
              )
                ? currentDate
                : latestDate,
            );
          } else {
            setSelectedDate(dayjs().format("YYYY-MM-DD"));
          }
        }
      })
      .catch((error) => {
        if (active) setStatus(error.message || "Unable to load attendance.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [classId]);

  const handleClassChange = (event) => {
    setIsLoading(true);
    setStatus("");
    setClassId(event.target.value);
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="rounded-md px-2 pb-4 shadow-md">
        <p className="mb-2 text-sm md:text-base">
          ACADEMIC SESSION: {session?.academicYear || "Select a saved session"}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-blue-600 md:text-lg">
            View Attendance
          </h2>
          <div className="flex items-center gap-2 rounded-xl bg-blue-600/10 px-2 py-1 text-xs md:text-base">
            <span className="flex items-center text-green-600">
              <FaDotCircle /> {summary.present} Present
            </span>
            <span className="flex items-center text-amber-600">
              <FaDotCircle /> {summary.late} Late
            </span>
            <span className="flex items-center text-red-600">
              <FaDotCircle /> {summary.absent} Absent
            </span>
          </div>
        </div>
      </div>

      <div className="my-4 rounded-md px-2 pb-4 shadow-md">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs text-base-content/70 md:text-base">
              CLASSROOM
            </span>
            <select
              onChange={handleClassChange}
              value={classId}
              className="select select-ghost select-sm rounded-md bg-blue-600/5"
              disabled={!classrooms.length}
            >
              {classrooms.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs text-base-content/70 md:text-base">
              DATE OF SESSION
            </span>
            <input
              type="date"
              className="input input-ghost input-sm max-w-36 rounded-md bg-blue-600/5"
              max={dayjs().format("YYYY-MM-DD")}
              onChange={(event) => setSelectedDate(event.target.value)}
              value={selectedDate}
            />
          </label>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-base-content/70 md:text-base">
              ATTENDANCE RATE
            </span>
            <p className="font-bold text-blue-600">
              {session ? `${summary.rate}%` : "-"}
            </p>
          </div>
        </div>
      </div>

      {status && (
        <p role="alert" className="my-3 text-sm text-error">
          {status}
        </p>
      )}

      {sessions.length > 0 && (
        <div className="my-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
          <span className="text-base-content/70">Saved sessions:</span>
          {sessions.map((item) => {
            const date = dayjs(item.date).format("YYYY-MM-DD");
            return (
              <button
                key={item._id}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`rounded-xl px-2 py-1 ${
                  date === selectedDate
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600/10 hover:bg-blue-600/20"
                }`}
              >
                {dayjs(date).format("ddd DD/MM")}
              </button>
            );
          })}
        </div>
      )}

      <div className="my-4">
        {isLoading ? (
          <p role="status" className="py-6 text-center text-sm">
            Loading attendance...
          </p>
        ) : !classroom ? (
          <p className="rounded-md p-6 text-center text-sm">
            Attendance is available only for classes assigned to you as class
            teacher.
          </p>
        ) : session ? (
          <>
            <div className="mb-4 grid grid-cols-5 px-2 text-sm font-bold md:text-base">
              <p>ID</p>
              <p>Name</p>
              <p>First Call</p>
              <p>Second Call</p>
              <p>Status</p>
            </div>
            {session.entries.map((entry) => (
              <AttendanceRecordRow
                key={entry.student}
                data={{
                  id: entry.studentId,
                  name: entry.studentName,
                  firstCall: entry.firstCall,
                  secondCall: entry.secondCall,
                }}
              />
            ))}
            <p className="text-sm text-base-content/70">
              {summary.total} students on{" "}
              {dayjs(session.date).format("dddd, DD/MM/YYYY")}
            </p>
          </>
        ) : (
          <div className="rounded-md p-6 text-center text-sm shadow-md md:text-base">
            <p className="font-bold">No attendance saved for this date</p>
            <p className="text-base-content/70">
              Choose a date with a saved attendance session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStudentAttendance;
