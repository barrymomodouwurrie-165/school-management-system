import { FaPhone, FaRegEnvelope } from "react-icons/fa";
import StaffContenButton from "./StaffContenButton";

const StaffContentCard = ({
  data,
  setAssign,
  setStaffName,
  setStaffId,
  onView,
  onEdit,
}) => {
  return (
    <>
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
        <button
          onClick={() => {
            setAssign(true);
            setStaffName(data.staff_name);
            setStaffId(data.staff_id);
          }}
          className="btn btn-outline btn-sm max-w-20"
        >
          Assign
        </button>
        <StaffContenButton
          onView={() => onView(data)}
          onEdit={() => onEdit(data)}
        />
      </div>
    </>
  );
};

export default StaffContentCard;
