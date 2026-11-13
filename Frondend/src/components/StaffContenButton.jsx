import { FaEye, FaPen } from "react-icons/fa";

const StaffContenButton = ({ onView, onEdit }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <button
        type="button"
        onClick={onView}
        className="btn btn-ghost btn-sm flex justify-start"
      >
        <FaEye />
        View Profile
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="btn btn-ghost btn-sm flex justify-start"
      >
        <FaPen />
        Edit
      </button>
    </div>
  );
};

export default StaffContenButton;
