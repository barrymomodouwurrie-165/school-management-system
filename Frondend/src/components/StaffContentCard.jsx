import { FaPhone, FaRegEnvelope } from "react-icons/fa";
import StaffContenButton from "./StaffContenButton";
import { useState } from "react";

const StaffContentCard = ({ data }) => {
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
        <div className="flex flex-col border-t pt-2 text-xs md:text-md">
          <span className="flex items-center gap-2">
            <p className="font-bold">Name:</p>{data.staff_name}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Gender:</p>{data.gender}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Email:</p>{data.email}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Phone:</p>{data.phone}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Nationality:</p>{data.nationality}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Role:</p> {data.role}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Department:</p>{data.department}{" "}
          </span>
          <span className="flex items-center gap-2">
            <p className="font-bold">Start Date:</p>{data.start_date}{" "}
          </span>
        </div>
      )}
    </div>
  );
};

export default StaffContentCard;
