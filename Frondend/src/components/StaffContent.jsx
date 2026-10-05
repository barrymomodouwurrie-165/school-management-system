import { Link } from "react-router";
import StaffContentCard from "./StaffContentCard";
import { FaBars } from "react-icons/fa";

const StaffContent = ({
  isOpen,
  setIsOpen,
  assign,
  setAssign,
  setStaffName,
  setStaffId,
}) => {
  const STAFF_DATA = [
    {
      id: "1",
      staff_id: "100001",
      initials: "AJ",
      staff_name: "Mr. A.Jallow",
      gender: "Male",
      nationality: "Gambian",
      role: "Teacher",
      department: "Mathematics",
      email: "a.jallow@school.com",
      phone: "+220833986565",
      section: "Junior",
      start_date: "05/08/2026",
    },
    {
      id: "2",
      staff_id: "100002",
      initials: "NF",
      staff_name: "Mrs. N.Faye",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "Integrated Science",
      email: "n.faye@school.com",
      phone: "+220833512298",
      section: "Junior",
      start_date: "05/08/2026",
    },
    {
      id: "3",
      staff_id: "100003",
      initials: "KD",
      staff_name: "Mr. K.Darboe",
      gender: "Male",
      nationality: "Gambian",
      role: "Head of department",
      department: "Mathematics",
      email: "k.darboe@school.com",
      phone: "+220877123845",
      section: "Senior",
      start_date: "05/08/2026",
    },
    {
      id: "4",
      staff_id: "100004",
      initials: "FC",
      staff_name: "Ms. F.Camara",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "English Language",
      email: "f.camara@school.com",
      phone: "+220866237761",
      section: "Junior",
      start_date: "05/08/2026",
    },
    {
      id: "5",
      staff_id: "100005",
      initials: "SN",
      staff_name: "Mr. S.Njie",
      gender: "Male",
      nationality: "Gambian",
      role: "Administrator",
      department: "Front Office",
      email: "s.njie@school.com",
      phone: "+2208335687921",
      section: "Both",
      start_date: "05/08/2026",
    },
    {
      id: "6",
      staff_id: "100006",
      initials: "BC",
      staff_name: "Mr. B.Colley",
      gender: "Male",
      nationality: "Gambian",
      role: "Support staff",
      department: "Facilities",
      email: "b.colley@school.com",
      phone: "+2208776659874",
      section: "Both",
      start_date: "05/08/2026",
    },
    {
      id: "7",
      staff_id: "100007",
      initials: "MJ",
      staff_name: "Mrs. M.Jobe",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "English",
      email: "m.jobe@school.com",
      phone: "+220872543219",
      section: "Junior",
      start_date: "05/08/2026",
    },
    {
      id: "8",
      staff_id: "100008",
      initials: "AT",
      staff_name: "Ms. A.Touray",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "French",
      email: "barrywurrytouray@gmail.com",
      phone: "+220833281347",
      section: "Senior",
      start_date: "05/08/2026",
    },
    {
      id: "9",
      staff_id: "100009",
      initials: "OS",
      staff_name: "Mr. O.Sowe",
      gender: "Male",
      nationality: "Gambian",
      role: "Teacher",
      department: "Physical Education",
      email: "o.sowe@school.com",
      phone: "+220866298534",
      section: "Both",
      data: "05/08/2026",
    },
    {
      id: "10",
      staff_id: "100010",
      initials: "IC",
      staff_name: "Mrs. I.Ceesay",
      gender: "Female",
      nationality: "Gambian",
      role: "Head of department",
      department: "G.Science",
      email: "i.ceesay@school.com",
      phone: "+220833476190",
      section: "Senior",
      start_date: "05/08/2026",
    },
    {
      id: "11",
      staff_id: "100011",
      initials: "LM",
      staff_name: "Mr. L.Manneh",
      gender: "Male",
      nationality: "Gambian",
      role: "Teacher",
      department: "Art",
      email: "l.manneh@school.com",
      phone: "+220877845213",
      section: "Junior",
      start_date: "05/08/2026",
    },
    {
      id: "12",
      staff_id: "100012",
      initials: "HB",
      staff_name: "Mrs. H.Bah",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "G.Agriculture",
      email: "h.bah@school.com",
      phone: "+220866297481",
      section: "Junior",
      start_date: "05/08/2026",
    },
  ];
  return (
    <div className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">STAFF DATA</h2>
          <p className="text-base-content/70">12 staff members shown</p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex-1 max-w-[500px] mr-2">
          <input
            type="text"
            placeholder="search name or department"
            className="input input-bordered w-full  rounded-lg"
          />
        </div>
        <button className="btn btn-outline rounded-lg">Show all</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 my-4">
        {STAFF_DATA &&
          STAFF_DATA.map((data) => {
            return (
              <div key={data.id} className="card self-start shadow-md p-3">
                <StaffContentCard
                  data={data}
                  assign={assign}
                  setAssign={setAssign}
                  setStaffName={setStaffName}
                  setStaffId={setStaffId}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StaffContent;
