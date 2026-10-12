import AttendanceRoster from "./AttendanceRoster";
import { FaDotCircle, FaSdCard } from "react-icons/fa";
import dayjs from "dayjs";
import { useState } from "react";
const MarkAttendance = () => {
  const [date] = useState(() => dayjs().format("DD/MM/YYYY"));
  const STUDENTS_DATA = [
    {
      id: "001",
      name: "Fatoumatta Jobe",
    },
    {
      id: "002",
      name: "Bubacarr Jallow",
    },
    {
      id: "003",
      name: "Ousman Saine",
    },
    {
      id: "004",
      name: "Mariama Bah",
    },
    {
      id: "005",
      name: "Mustapha Colley",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="rounded-md shadow-md px-2 pb-4">
        <p className="text-sm md:text-bas mb-2">ACADEMIC SESSION: 2025/26</p>
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-lg font-bold text-blue-600">
            Mark Attendance
          </h2>
          <div className="flex items-center gap-2 text-xs md:text-base bg-blue-600/10 px-2 py-1 rounded-xl">
            <span className="flex items-center text-green-600">
              <FaDotCircle />5 Present
            </span>
            <span className="flex items-center text-amber-600">
              <FaDotCircle />0 Late
            </span>
            <span className="flex items-center text-red-600">
              <FaDotCircle />1 Absent
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 my-2 rounded-md shadow-md p-2">
        <div className="flex flex-col gap-1">
          <p className="text-base-content/70">Classroom</p>
          <span className="bg-blue-600/5 rounded-md">
            <select
              className="select select-ghost select-sm rounded-md"
              name=""
              id=""
            >
              <option value="Grade 10 A">Grade 10 A</option>
              <option value="Grade 11 A">Grade 11 A</option>
            </select>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base-content/70">Date of session</p>
          <span className="bg-blue-600/5 rounded-md max-w-28">
            <input
              className="input input-ghost input-sm"
              type="text"
              value={date}
              readOnly
            />
          </span>
        </div>
      </div>
      <div className="my-4">
        <div className="grid grid-cols-4 font-bold text-sm md:text-base px-2 mb-4">
          <p>ID</p>
          <p>Name</p>
          <p>First Call</p>
          <p>Second Call</p>
        </div>
        {STUDENTS_DATA &&
          STUDENTS_DATA.map((data) => {
            return <AttendanceRoster key={data.id} data={data} />;
          })}
      </div>
      <div className="my-2 flex items-center gap-2 text-sm md:text-base">
        <button className="btn btn-primary btn-sm rounded-md">
          <FaSdCard className="text-white" size={12}/> Save attendance
        </button>
        <p>Last synced: Today, 08:30 AM</p>
      </div>
    </div>
  );
};

export default MarkAttendance;
