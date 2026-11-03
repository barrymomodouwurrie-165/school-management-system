import { FiMail, FiPrinter, FiCalendar } from "react-icons/fi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router";
import StaffView from "./StaffView";

const AdminStatus = ({
  facultyStatus = [],
  headOfBlocks = [],
  isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-top gap-4 justify-between py-6">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col border border-base-content/20 rounded-lg">
          <div className="flex items-center justify-between px-4 py-4 bg-base-content/5 rounded-t-lg">
            <span>FACULTY STATUS - DEPARTMENTS</span>
            <Link>
              <BsThreeDots />
            </Link>
          </div>
          <div className="grid grid-cols-3 items-center justify-between px-4 py-4 bg-base-content/5 border-t border-base-content/20">
            <span className="text-[10px] md:text-base font-bold">DEPARTMENT</span>
            <span className="text-[10px] md:text-base font-bold ml-2 md:ml-0">
              HEAD OF DEPARTMENT
            </span>
            <span className="text-[10px] md:text-base font-bold">NUMBER OF STAFF</span>
          </div>
          {isLoading ? (
            <p role="status" className="px-4 py-6 text-sm text-base-content/60">
              Loading department status...
            </p>
          ) : facultyStatus.length ? (
            <StaffView Staff={facultyStatus} />
          ) : (
            <p className="px-4 py-6 text-sm text-base-content/60">
              No department staff records found.
            </p>
          )}
        </div>
        <div className="flex flex-col border border-base-content/20 rounded-lg">
          <div className="flex items-center justify-between px-4 py-4 bg-base-content/5 rounded-t-lg">
            <span>FACULTY STATUS - HEAD OF BLOCKS</span>
            <BsThreeDots aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 items-center px-4 py-4 bg-base-content/5 border-t border-base-content/20">
            <span className="text-xs font-bold md:text-base">BLOCK</span>
            <span className="text-xs font-bold md:text-base">HEAD OF BLOCK</span>
          </div>
          {isLoading ? (
            <p role="status" className="px-4 py-6 text-sm text-base-content/60">
              Loading block assignments...
            </p>
          ) : (
            headOfBlocks.map(({ block, heads }) => (
              <div
                key={block}
                className="grid grid-cols-2 items-center border-t border-base-content/20 px-4 py-2"
              >
                <span className="text-xs md:text-base">{block}</span>
                <span className="text-xs md:text-base">{heads}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-6 border border-base-content/20 rounded-lg bg-blue-950">
          <h2 className="text-xl font-bold text-white my-2">Quick Tools</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link className="text-center bg-base-content/30 px-2 py-4 rounded-md text-white border border-white/30 flex flex-col items-center justify-center gap-2">
              <FiMail />
              Send Email
            </Link>
            <Link className="text-center bg-base-content/30 px-2 py-4 rounded-md text-white border border-white/30 flex flex-col items-center justify-center gap-2">
              <FiPrinter />
              Print ID
            </Link>
            <Link className="text-center bg-base-content/30 px-2 py-4 rounded-md text-white border border-white/30 flex flex-col items-center justify-center gap-2">
              <FiCalendar />
              Calendar
            </Link>
            <Link className="text-center bg-base-content/30 px-2 py-4 rounded-md text-white border border-white/30 flex flex-col items-center justify-center gap-2">
              <FaMoneyCheckAlt />
              Fees
            </Link>
          </div>
        </div>
        <div className="border border-base-content/20 rounded-lg">
          <h2 className="text-xl font-bold py-1 bg-base-content/5 px-2">
            Student Leaders
          </h2>
          <div className="grid grid-cols-3 border-t border-base-content/10 py-2 bg-base-content/5 px-2">
            <span>Name</span>
            <span>Class</span>
            <span>Position</span>
          </div>
          <div className="grid grid-cols-3 border-t border-base-content/10 py-2 gap-2 px-2">
            <span className="col-">Modou Bah</span>
            <span>12A1</span>
            <span>Head-Boy</span>
          </div>
          <div className="grid grid-cols-3 border-t border-base-content/10 py-2 px-2">
            <span>Aminata Baldeh</span>
            <span>12C2</span>
            <span>Head-Girl</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatus;
