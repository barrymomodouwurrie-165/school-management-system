import { FiMail, FiPrinter, FiCalendar } from "react-icons/fi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router";
import StaffView from "./StaffView";

const AdminStatus = () => {
  const Staff = [
    {
      id: "1",
      subject: "English Language",
      name: "Mr. Colley",
      count: "12 Memebers",
      schedule: "ON SCHEDULE",
      color: "green",
    },
    {
      id: "2",
      subject: "Science",
      name: "Mr. Samba",
      count: "10 Memebers",
      schedule: "PENDING REPORTS",
      color: "amber",
    },
    {
      id: "3",
      subject: "Mathematics",
      name: "Mr. Barry",
      count: "5 Memebers",
      schedule: "ON SCHEDULE",
      color: "green",
    },
    {
      id: "4",
      subject: "Civic Education",
      name: "Mr. Mendy",
      count: "4 Memebers",
      schedule: "ON SCHEDULE",
      color: "green",
    },
    {
      id: "5",
      subject: "Physics",
      name: "Mr. Manga",
      count: "3 Memebers",
      schedule: "ON SCHEDULE",
      color: "green",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row items-top gap-4 justify-between py-6">
      <div className="flex flex-col border border-base-content/20 rounded-lg">
        <div className="flex items-center justify-between px-4 py-4 bg-base-content/5 rounded-t-lg">
          <span>FACULTY STATUS - ACTIVE DEPARTMENTS</span>
          <Link>
            <BsThreeDots />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-6 md:gap-1 items-center justify-between px-4 py-4 bg-base-content/5 border-t border-base-content/20">
          <span className="text-[10px] md:text-base font-bold">DEPARTMENT</span>
          <span className="text-[10px] md:text-base font-bold">HEAD OF DEPARTMENT</span>
          <span className="text-[10px] md:text-base font-bold">COUNT</span>
          <span className="text-[10px] md:text-base font-bold">STATUS</span>
          <span className="text-[10px] md:text-base font-bold">ACTION</span>
        </div>
        <StaffView Staff={Staff} />
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
