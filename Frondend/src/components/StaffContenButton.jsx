import { FaEye, FaPen, FaEyeSlash } from "react-icons/fa";

const StaffContenButton = ({ view, setView, onEdit }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <button
        type="button"
        onClick={() => setView(!view)}
        className="btn btn-ghost btn-sm flex justify-start"
      >
        {view ? (
          <div className="flex items-center gap-1">
            <FaEyeSlash /> Close Profile
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <FaEye /> View Profile
          </div>
        )}
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
