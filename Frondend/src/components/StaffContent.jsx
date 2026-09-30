import StaffContentCard from "./StaffContentCard";

const StaffContent = () => {
  const STAFF_DATA = [
    {
      id: "1",
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
      initials: "AT",
      staff_name: "Ms. A.Touray",
      gender: "Female",
      nationality: "Gambian",
      role: "Teacher",
      department: "French",
      email: "a.touray@school.com",
      phone: "+220833281347",
      section: "Senior",
      start_date: "05/08/2026",
    },
    {
      id: "9",
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
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">STAFF DATA</h2>
        <p className="text-base-content/70">12 staff members shown</p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
        {STAFF_DATA &&
          STAFF_DATA.map((data) => {
            return <StaffContentCard data={data} />;
          })}
      </div>
    </div>
  );
};

export default StaffContent;
