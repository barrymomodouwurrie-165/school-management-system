import { FaPhone, FaRegEnvelope } from "react-icons/fa";
import StaffContenButton from "./StaffContenButton";
import { useState } from "react";

const StaffContentCard = ({data}) => {
     const [view, setView] = useState(false);
  return (
    <div key={data.id} className="card self-start shadow-md p-3">
      <div className="flex items-center gap-2">
        <div className="flex justify-center bg-blue-950 text-white rounded-md px-2 py-1">
          {data.initials}
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{data.staff_name}</span>
          <p className="text-base-content/70 text-xs">
            {data.role}, {data.department}
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-2 text-sm text-base-content/70">
        <div className="flex items-center gap-2">
          <FaRegEnvelope />
          <p>{data.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone />
          <p>{data.phone}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t mt-2 py-2">
        <div className="p-1 w-16 flex justify-center rounded-full border border-blue-950 text-sm">
          {data.section}
        </div>
        <StaffContenButton view={view} setView={setView} />
      </div>
      {view && (
        <div className="flex flex-col border-t pt-2">
          <span>Name: {data.staff_name} </span>
          <span>Gender: {data.gender} </span>
          <span>Email: {data.email} </span>
          <span>Phone No: {data.phone} </span>
          <span>Nationality: {data.nationality} </span>
          <span>Role: {data.role} </span>
          <span>Department: {data.department} </span>
          <span>Start Date: {data.start_date} </span>
        </div>
      )}
    </div>
  );
};

export default StaffContentCard;
