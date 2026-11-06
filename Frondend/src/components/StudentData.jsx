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
    <div key={data.id} className="grid grid-cols-6 gap-4 text-xs md:text-base px-2 py-3 border-t">
      <span className="">{data.student_name}</span>
      <span className="ml-3 md:ml-0">{data.class}</span>
      <span>{data.section}</span>
      <span>{data.guardian_name}</span>
      <div
        className={`${statusColor} flex h-[25px] w-[80px] justify-center rounded-md text-sm text-white md:w-[100px]`}
      >
        {data.status}
      </div>
      <div className="flex flex-col items-end justify-start gap-2 sm:flex-row sm:items-start sm:justify-center">
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
      {isView && (
        <div className="flex flex-col gap-2 mt-4 border-t pt-2 col-span-full">
          <span className="flex item-center gap-2">
            <p className="font-bold"> Student ID:</p> {data.student_id}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Student Name:</p>
            {data.student_name}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Gender:</p>
            {data.gender}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Nationality:</p>
            {data.nationality}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Ethnicity:</p>
            {data.ethnicity}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">D.O.B:</p>
            {data.dob}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Section:</p>
            {data.section}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Class:</p>
            {data.class}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Date Enrolled</p>
            {data.date_enrolled}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Guardian Name:</p>
            {data.guardian_name}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Guardian Tel:</p>
            {data.guardian_tel}
          </span>
          <span className="flex item-center gap-2">
            <p className="font-bold">Address:</p>
            {data.address}
          </span>
        </div>
      )}
    </div>
  );
};

export default StudentData;
