/* eslint-disable react-refresh/only-export-components */
import { FaCheck, FaTimes } from "react-icons/fa";

export const getStatus = ({ firstCall, secondCall }) => {
  if (firstCall) return "Present";
  if (secondCall) return "Late";
  return "Absent";
};

const STATUS_STYLES = {
  Present: "bg-green-600/10 text-green-700",
  Late: "bg-amber-600/10 text-amber-700",
  Absent: "bg-red-600/10 text-red-700",
};

const CallMark = ({ marked }) =>
  marked ? (
    <FaCheck className="text-green-600" size={12} aria-label="Marked" />
  ) : (
    <FaTimes
      className="text-base-content/30"
      size={12}
      aria-label="Not marked"
    />
  );

const AttendanceRecordRow = ({ data }) => {
  const status = getStatus(data);

  return (
    <div className="grid grid-cols-5 items-center text-sm md:text-base rounded-sm shadow-md mb-4 px-2 py-1 hover:bg-blue-600/10">
      <span>{data.id}</span>
      <span className="text-xs md:text-base">{data.name}</span>
      <span className="pl-6">
        <CallMark marked={data.firstCall} />
      </span>
      <span className="pl-8">
        <CallMark marked={data.secondCall} />
      </span>
      <span>
        <span
          className={`text-xs md:text-sm px-2 py-0.5 rounded-xl ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </span>
    </div>
  );
};

export default AttendanceRecordRow;
