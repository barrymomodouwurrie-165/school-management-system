import { BiEdit } from "react-icons/bi";
import { FiMail, FiPrinter, FiCalendar } from "react-icons/fi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router";

const AdminStatus = () => {
  return (
    <div className="flex items-top gap-4 justify-between py-6">
      <div className="flex flex-col border border-base-content/20 rounded-lg">
        <div className="flex items-center justify-between px-4 py-4 bg-base-content/5 rounded-t-lg">
          <span>FACULTY STATUS - ACTIVE DEPARTMENTS</span>
          <Link>
            <BsThreeDots />
          </Link>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-4 bg-base-content/5 border-t border-base-content/20">
          <span className="font-bold">DEPARTMENT</span>
          <span className="font-bold">HEAD OF DEPT</span>
          <span className="font-bold">COUNT</span>
          <span className="font-bold">STATUS</span>
          <span className="font-bold">ACTION</span>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-2 border-t border-base-content/20">
          <span className="">English Language</span>
          <span className="">Mr. Colley</span>
          <span className="">12 Members</span>
          <span className="text-green-600">ON SCHEDULE</span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-2 border-t border-base-content/20">
          <span className="">Mathematics</span>
          <span className="">Mr. Barry</span>
          <span className="">8 Members</span>
          <span className="text-green-600">ON SCHEDULE</span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-2 border-t border-base-content/20">
          <span className="">Science</span>
          <span className="">Mr. Samba</span>
          <span className="">10 Members</span>
          <span className="text-amber-600">PENDING REPORTS</span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-2 border-t border-base-content/20">
          <span className="">Civic Education</span>
          <span className="">Mr. Mendy</span>
          <span className="">12 Members</span>
          <span className="text-green-600">ON SCHEDULE</span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-5 items-center justify-between px-4 py-2 border-t border-base-content/20">
          <span className="">Physics</span>
          <span className="">Miss Manga</span>
          <span className="">4 Members</span>
          <span className="text-green-600">ON SCHEDULE</span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
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
          <h2 className="text-xl font-bold py-1 bg-base-content/5 px-2">Student Leaders</h2>
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
