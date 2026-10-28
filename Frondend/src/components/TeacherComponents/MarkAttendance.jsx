import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaDotCircle, FaSdCard } from "react-icons/fa";
import AttendanceRoster from "./AttendanceRoster";
import {
  getTeacherAttendanceClasses,
  getClassAttendanceSessions,
  saveClassAttendanceCall,
} from "../../utils/attendanceApi";

const getStatus = ({ firstCall, secondCall }) => {
  if (firstCall) return "Present";
  if (secondCall) return "Late";
  return "Absent";
};

const getAcademicYear = (date) => {
  const parsed = dayjs(date);
  const startYear = parsed.month() >= 8 ? parsed.year() : parsed.year() - 1;
  return `${startYear}/${String(startYear + 1).slice(-2)}`;
};

const EMPTY_STUDENTS = [];

const buildMarks = (students, session) =>
  Object.fromEntries(
    students.map((student) => {
      const savedEntry = session?.entries.find(
        (entry) => String(entry.student) === String(student._id),
      );
      return [
        String(student._id),
        {
          firstCall: savedEntry?.firstCall ?? false,
          secondCall: savedEntry?.secondCall ?? false,
        },
      ];
    }),
  );

const MarkAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [classId, setClassId] = useState("");
  const [session, setSession] = useState(null);
  const [marks, setMarks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const date = dayjs().format("YYYY-MM-DD");

  const classroom = classrooms.find((item) => item._id === classId);
  const students = classroom?.students ?? EMPTY_STUDENTS;
  const stage = session?.secondCallSavedAt
    ? 2
    : session?.firstCallSavedAt
      ? 1
      : 0;
  const showSummary = stage === 2;
  const isSchoolDay = dayjs(date).day() !== 0 && dayjs(date).day() !== 6;

  const summary = useMemo(() => {
    const counts = { Present: 0, Late: 0, Absent: 0 };
    students.forEach((student) => {
      const mark = marks[String(student._id)];
      if (mark) counts[getStatus(mark)] += 1;
    });
    return counts;
  }, [marks, students]);

  useEffect(() => {
    let active = true;
    getTeacherAttendanceClasses()
      .then((result) => {
        if (active) {
          setClassrooms(result);
          setClassId(result[0]?._id ?? "");
          if (!result.length) {
            setStatus({
              type: "error",
              message: "No active classes are assigned to your account.",
            });
            setIsLoading(false);
          }
        }
      })
      .catch((error) => {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Unable to load your classes.",
          });
          setIsLoading(false);
        }
      })

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!classId || !classroom) return undefined;
    let active = true;
    getClassAttendanceSessions(classId, date)
      .then((result) => {
        if (active) {
          setSession(result);
          setMarks(buildMarks(classroom.students, result));
        }
      })
      .catch((error) => {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Unable to load today's attendance.",
          });
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [classId, classroom, date]);

  const handleToggle = (studentId, call) => {
    setMarks((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        [call]: !current[studentId][call],
      },
    }));
  };

  const handleClassChange = (event) => {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    setClassId(event.target.value);
  };

  const handleSave = async () => {
    if (!classroom || !students.length) return;
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const call = stage === 0 ? "first" : "second";
      const savedSession = await saveClassAttendanceCall(classId, {
        date,
        academicYear: session?.academicYear || getAcademicYear(date),
        call,
        entries: students.map((student) => ({
          studentId: String(student._id),
          [call === "first" ? "firstCall" : "secondCall"]:
            marks[String(student._id)]?.[
              call === "first" ? "firstCall" : "secondCall"
            ] ?? false,
        })),
      });
      setSession(savedSession);
      setMarks(buildMarks(students, savedSession));
      setStatus({
        type: "success",
        message: call === "first" ? "First call saved." : "Attendance saved.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save attendance.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !classroom) {
    return (
      <p role="status" className="mx-auto max-w-4xl p-4">
        Loading assigned classes...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="rounded-md px-2 pb-4 shadow-md">
        <p className="mb-2 text-sm md:text-base">
          ACADEMIC SESSION: {session?.academicYear || getAcademicYear(date)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-blue-600 md:text-lg">
            Mark Attendance
          </h2>
          {showSummary ? (
            <div className="flex items-center gap-2 rounded-xl bg-blue-600/10 px-2 py-1 text-xs md:text-base">
              <span className="flex items-center text-green-600">
                <FaDotCircle /> {summary.Present} Present
              </span>
              <span className="flex items-center text-amber-600">
                <FaDotCircle /> {summary.Late} Late
              </span>
              <span className="flex items-center text-red-600">
                <FaDotCircle /> {summary.Absent} Absent
              </span>
            </div>
          ) : (
            <p className="text-xs text-base-content/70 md:text-sm">
              Summary shows after the second call is saved
            </p>
          )}
        </div>
      </div>

      <div className="my-2 flex items-center gap-4 rounded-md p-2 shadow-md">
        <label className="flex flex-col gap-1">
          <span className="text-base-content/70">Classroom</span>
          <select
            className="select select-ghost select-sm rounded-md bg-blue-600/5"
            onChange={handleClassChange}
            value={classId}
            disabled={!classrooms.length}
          >
            {classrooms.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-base-content/70">Today's Date</span>
          <input
            className="input input-ghost input-sm max-w-36 bg-blue-600/5"
            type="date"
            value={date}
            readOnly
          />
        </label>
      </div>

      {!isSchoolDay && (
        <p className="my-2 text-sm text-red-600">
          Weekends are not school days, so attendance can't be saved today.
        </p>
      )}

      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`my-3 text-sm ${
            status.type === "error" ? "text-error" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="my-4 text-sm text-base-content/70">
          Loading attendance...
        </p>
      ) : !classroom ? (
        <p className="my-4 text-sm text-base-content/70">
          Attendance is available only for classes assigned to you as class
          teacher.
        </p>
      ) : students.length === 0 ? (
        <p className="my-4 text-sm text-base-content/70">
          No students are currently registered in {classroom.name}.
        </p>
      ) : (
        <>
          <div className="my-4">
            <div className="mb-4 grid grid-cols-4 px-2 text-sm font-bold md:text-base">
              <p>ID</p>
              <p>Name</p>
              <p>First Call</p>
              <p>Second Call</p>
            </div>
            {students.map((student) => (
              <AttendanceRoster
                key={student._id}
                data={{
                  id: String(student._id),
                  displayId: student.student_id,
                  name: `${student.first_name} ${student.last_name}`,
                }}
                marks={
                  marks[String(student._id)] || {
                    firstCall: false,
                    secondCall: false,
                  }
                }
                onToggle={handleToggle}
                firstDisabled={stage >= 1 || isSaving}
                secondDisabled={stage !== 1 || isSaving}
              />
            ))}
          </div>
          <div className="my-2 flex flex-wrap items-center gap-2 text-sm md:text-base">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-md"
              onClick={handleSave}
              disabled={
                !isSchoolDay ||
                stage === 2 ||
                isSaving ||
                students.length === 0
              }
            >
              <FaSdCard className="text-white" size={12} />
              {isSaving
                ? "Saving..."
                : stage === 0
                  ? "Save first call"
                  : stage === 1
                    ? "Save second call"
                    : "Attendance saved"}
            </button>
            <p>
              Last synced:{" "}
              {session?.secondCallSavedAt
                ? dayjs(session.secondCallSavedAt).format("hh:mm A")
                : session?.firstCallSavedAt
                  ? `First call, ${dayjs(session.firstCallSavedAt).format("hh:mm A")}`
                  : "Not yet saved"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
