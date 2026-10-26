/* eslint-disable react-refresh/only-export-components */
import AttendanceRoster from "./AttendanceRoster";
import { FaDotCircle, FaSdCard } from "react-icons/fa";
import dayjs from "dayjs";
import { useState } from "react";

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

const CLASSROOMS = Object.keys(STUDENTS_BY_CLASS);


const buildInitialAttendance = () =>
  Object.fromEntries(
    Object.entries(STUDENTS_BY_CLASS).map(([className, students]) => [
      className,
      Object.fromEntries(
        students.map((s) => [s.id, { firstCall: false, secondCall: false }]),
      ),
    ]),
  );
  
const buildInitialProgress = () =>
  Object.fromEntries(
    CLASSROOMS.map((c) => [c, { stage: 0, syncedAt: null }]),
  );

export const getStatus = ({ firstCall, secondCall }) => {
  if (firstCall && secondCall) return "Present";
  if (!firstCall && secondCall) return "Late";
  return "Absent"; 
};

const MarkAttendance = () => {
  const [classroom, setClassroom] = useState(CLASSROOMS[0]);
  const [attendance, setAttendance] = useState(buildInitialAttendance);
  const [progress, setProgress] = useState(buildInitialProgress);

  const { stage, syncedAt } = progress[classroom];
  const showSummary = stage === 2;

  const today = dayjs();
  const date = today.format("YYYY-MM-DD");
  const dayOfWeek = today.day();
  const isSchoolDay = dayOfWeek !== 0 && dayOfWeek !== 6;

  const students = STUDENTS_BY_CLASS[classroom];
  const marks = attendance[classroom];

  const handleToggle = (studentId, call) => {
    setAttendance((prev) => ({
      ...prev,
      [classroom]: {
        ...prev[classroom],
        [studentId]: {
          ...prev[classroom][studentId],
          [call]: !prev[classroom][studentId][call],
        },
      },
    }));
  };

  const summary = { Present: 0, Late: 0, Absent: 0 };
  students.forEach((s) => {
    summary[getStatus(marks[s.id])] += 1;
  });

  const handleSave = () => {
    const now = dayjs().format("hh:mm A");

    if (stage === 0) {
      
      console.log({
        date,
        classroom,
        call: "first",
        records: students.map((s) => ({
          ...s,
          firstCall: marks[s.id].firstCall,
        })),
      });
    } else if (stage === 1) {
      
      console.log({
        date,
        classroom,
        call: "second",
        records: students.map((s) => ({
          ...s,
          ...marks[s.id],
          status: getStatus(marks[s.id]),
        })),
      });
    }

    setProgress((prev) => ({
      ...prev,
      [classroom]: { stage: prev[classroom].stage + 1, syncedAt: now },
    }));
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="rounded-md shadow-md px-2 pb-4">
        <p className="text-sm md:text-base mb-2">ACADEMIC SESSION: 2025/26</p>
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-lg font-bold text-blue-600">
            Mark Attendance
          </h2>
          {showSummary ? (
            <div className="flex items-center gap-2 text-xs md:text-base bg-blue-600/10 px-2 py-1 rounded-xl">
              <span className="flex items-center text-green-600">
                <FaDotCircle />
                {summary.Present} Present
              </span>
              <span className="flex items-center text-amber-600">
                <FaDotCircle />
                {summary.Late} Late
              </span>
              <span className="flex items-center text-red-600">
                <FaDotCircle />
                {summary.Absent} Absent
              </span>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-base-content/70">
              Summary shows after the second call is saved
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 rounded-md shadow-md p-2">
        <div className="flex flex-col gap-1">
          <p className="text-base-content/70">Classroom</p>
          <span className="bg-blue-600/5 rounded-md">
            <select
              className="select select-ghost select-sm rounded-md"
              onChange={(e) => setClassroom(e.target.value)}
              value={classroom}
            >
              {CLASSROOMS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base-content/70">Today's Date</p>
          <span className="bg-blue-600/5 rounded-md max-w-36">
            <input
              className="input input-ghost input-sm"
              type="date"
              value={date}
              readOnly
            />
          </span>
        </div>
      </div>

      {!isSchoolDay && (
        <p className="text-sm text-red-600 my-2">
          Weekends are not school days, so attendance can't be saved today.
        </p>
      )}

      <div className="my-4">
        <div className="grid grid-cols-4 font-bold text-sm md:text-base px-2 mb-4">
          <p>ID</p>
          <p>Name</p>
          <p>First Call</p>
          <p>Second Call</p>
        </div>
        {students.map((student) => (
          <AttendanceRoster
            key={student.id}
            data={student}
            marks={marks[student.id]}
            onToggle={handleToggle}
            firstDisabled={stage >= 1}
            secondDisabled={stage !== 1}
          />
        ))}
      </div>

      <div className="my-2 flex items-center gap-2 text-sm md:text-base">
        <button
          className="btn btn-primary btn-sm rounded-md"
          onClick={handleSave}
          disabled={!isSchoolDay || stage === 2}
        >
          <FaSdCard className="text-white" size={12} />
          {stage === 0 && "Save first call"}
          {stage === 1 && "Save second call"}
          {stage === 2 && "Attendance saved"}
        </button>
        <p>Last synced: {syncedAt ? `Today, ${syncedAt}` : "Not yet saved"}</p>
      </div>
    </div>
  );
};

export default MarkAttendance;
