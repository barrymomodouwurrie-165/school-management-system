import { FaEye, FaEyeSlash, FaKey, FaPen } from "react-icons/fa";
import { useState } from "react";

const StudentData = ({ data, onEdit, onProvisionGuardian, isProvisioning }) => {
  const [isView, setIsView] = useState(false);
  const statusColor =
    data.color === "green"
      ? "bg-green-600"
      : data.color === "yellow"
        ? "bg-amber-500"
        : "bg-slate-500";

  return (
    <div
      className="grid min-w-[790px] grid-cols-[minmax(150px,1.2fr)_minmax(110px,0.8fr)_minmax(110px,0.8fr)_minmax(170px,1.4fr)_minmax(120px,0.8fr)_minmax(130px,1fr)] items-center gap-4 border-t px-2 py-3 text-sm"
    >
      <div className="min-w-0">
        <span className="block break-words leading-snug">
          {data.student_name}
        </span>
      </div>
      <div className="min-w-0">
        <span className="block break-words leading-snug">{data.class}</span>
      </div>
      <div className="min-w-0">
        <span className="block break-words leading-snug">{data.section}</span>
      </div>
      <div className="min-w-0">
        <span className="block break-words leading-snug">
          {data.guardian_name}
        </span>
      </div>
      <div className="min-w-0">
        <span
          className={`${statusColor} inline-flex h-auto max-w-full items-center justify-center rounded-md px-2 py-1 text-center text-xs leading-tight text-white`}
        >
          {data.status}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-col items-start gap-1 md:flex-row md:flex-nowrap">
          <button
            type="button"
            onClick={() => setIsView(!isView)}
            className="btn btn-ghost btn-xs"
            aria-label={`${isView ? "Hide" : "View"} details for ${data.student_name}`}
            title={isView ? "Hide details" : "View details"}
          >
            {isView ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="btn btn-ghost btn-xs"
            aria-label={`Edit ${data.student_name}`}
            title="Edit student"
          >
            <FaPen size={12} />
          </button>
          <button
            type="button"
            onClick={onProvisionGuardian}
            disabled={isProvisioning || data.status === "Transferred"}
            className="btn btn-ghost btn-xs"
            aria-label={`Provision guardian portal access for ${data.student_name}`}
            title="Provision guardian portal access"
          >
            <FaKey size={12} />
          </button>
        </div>
      </div>
      {isView && (
        <div className="col-span-full mt-2 grid min-w-0 gap-2 border-t pt-3 text-sm sm:grid-cols-2">
          <p className="break-words">
            <strong>Student ID:</strong> {data.student_id}
          </p>
          <p className="break-words">
            <strong>Student Name:</strong> {data.student_name}
          </p>
          <p className="break-words">
            <strong>Gender:</strong> {data.gender}
          </p>
          <p className="break-words">
            <strong>Nationality:</strong> {data.nationality}
          </p>
          <p className="break-words">
            <strong>Ethnicity:</strong> {data.ethnicity}
          </p>
          <p className="break-words">
            <strong>D.O.B:</strong> {data.dob}
          </p>
          <p className="break-words">
            <strong>Section:</strong> {data.section}
          </p>
          <p className="break-words">
            <strong>Class:</strong> {data.class}
          </p>
          <p className="break-words">
            <strong>Date Enrolled:</strong> {data.date_enrolled}
          </p>
          <p className="break-words">
            <strong>Guardian Name:</strong> {data.guardian_name}
          </p>
          <p className="break-words">
            <strong>Guardian Tel:</strong> {data.guardian_tel}
          </p>
          <p className="break-words">
            <strong>Address:</strong> {data.address}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentData;
