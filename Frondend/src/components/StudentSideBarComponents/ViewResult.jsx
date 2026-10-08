import { FaExclamationTriangle } from "react-icons/fa";
const ViewResult = ({ viewResult, setViewResult }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => setViewResult(!viewResult)}
        className="btn btn-outline btn-sm rounded-md hidden md:flex"
      >
        Back
      </button>
      <div className="max-w-sm min-h-[50vh] mx-auto flex items-center justify-center">
        <span className="flex flex-col items-center gap-2">
          <FaExclamationTriangle size={24} className="text-red-600" />
          <p className="text-center font-sans font-bold">
            Your result for this academic term is not yet publish for viewing.
            Try again later!
          </p>
        </span>
      </div>
    </div>
  );
};

export default ViewResult;
