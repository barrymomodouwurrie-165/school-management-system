import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import { useState } from "react";

const StudentData = ({ data }) => {
  const [isView, setIsView] = useState(false);
  return (
    <div key={data.id} className="grid grid-cols-6 gap-4 text-xs md:text-base px-2 py-3 border-t">
      <span className="">{data.student_name}</span>
      <span className="ml-3 md:ml-0">{data.class}</span>
      <span>{data.section}</span>
      <span>{data.guardian_name}</span>
      <div
        className={`${data.color === "green" ? "bg-green-600" : "bg-red-600"} flex justify-center w-[80px] h-[25px] md:w-[100px]  md:h-[25px] rounded-md text-sm text-white`}
      >
        {data.status}
      </div>
      <div className="flex items-end md:items-start justify-end gap-4 flex-col md:justify-start">
        <Link onClick={() => setIsView(!isView)} className="max-w-[20px]">
          {isView ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
        </Link>
        <Link className="max-w-[20px]">
          <FaPen size={12} />
        </Link>
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
