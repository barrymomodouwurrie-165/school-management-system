import { Link } from "react-router";
import StudentData from "./StudentData";
import { FaBars } from "react-icons/fa";

const StudentsContent = ({ isOpen, setIsOpen }) => {
  const STUDENT_DATA = [
    {
      id: "1",
      student_name: "Aminate Bah",
      student_id: "20252026001",
      gender: "Female",
      nationality: "Gambian",
      ethnicity: "Mandinka",
      dob: "14/03/2013",
      class: "Grade 7A",
      section: "Junior",
      date_enrolled: "02/09/2019",
      guardian_name: "Fatou Bah",
      guardian_tel: "+220789451203",
      address: "Bakau, Kanifing",
      status: "Active",
      color: "green",
    },
    {
      id: "2",
      student_name: "Ebrima Sanneh",
      student_id: "20252026002",
      gender: "Male",
      nationality: "Gambian",
      ethnicity: "Fula",
      dob: "22/07/2013",
      class: "Grade 7A",
      section: "Junior",
      date_enrolled: "02/09/2019",
      guardian_name: "Ousman Sanneh",
      guardian_tel: "+220671298456",
      address: "Serrekunda, Kanifing",
      status: "Active",
      color: "green",
    },
    {
      id: "3",
      student_name: "Haddy Jallow",
      student_id: "20252026003",
      gender: "Female",
      nationality: "Gambian",
      ethnicity: "Fula",
      dob: "09/11/2012",
      class: "Grade 7B",
      section: "Junior",
      date_enrolled: "03/09/2018",
      guardian_name: "Mariama Jallow",
      guardian_tel: "+220834567129",
      address: "Latrikunda, Kanifing",
      status: "Active",
      color: "green",
    },
    {
      id: "4",
      student_name: "Momodou Ceesay",
      student_id: "20252026004",
      gender: "Male",
      nationality: "Gambian",
      ethnicity: "Jola",
      dob: "17/01/2013",
      class: "Grade 7B",
      section: "Junior",
      date_enrolled: "03/09/2018",
      guardian_name: "Alieu Ceesay",
      guardian_tel: "+220912345678",
      address: "Brikama, West Coast",
      status: "Suspended",
      color: "yellow",
    },
    {
      id: "5",
      student_name: "Fatoumata Jobe",
      student_id: "20252026005",
      gender: "Female",
      nationality: "Gambian",
      ethnicity: "Wolof",
      dob: "28/05/2010",
      class: "Grade 10A",
      section: "Senior",
      date_enrolled: "04/09/2016",
      guardian_name: "Binta Jobe",
      guardian_tel: "+220765432198",
      address: "Fajara, Kanifing",
      status: "Active",
      color: "green",
    },
    {
      id: "6",
      student_name: "Karamo Touray",
      student_id: "20252026006",
      gender: "Male",
      nationality: "Gambian",
      ethnicity: "Mandinka",
      dob: "03/02/2010",
      class: "Grade 10A",
      section: "Senior",
      date_enrolled: "04/09/2016",
      guardian_name: "Sarjo Touray",
      guardian_tel: "+220698712345",
      address: "Brufut, West Coast",
      status: "Active",
      color: "green",
    },
    {
      id: "7",
      student_name: "Ndey Faal",
      student_id: "20252026007",
      gender: "Female",
      nationality: "Gambian",
      ethnicity: "Jola",
      dob: "19/09/2009",
      class: "Grade 11B",
      section: "Senior",
      date_enrolled: "05/09/2015",
      guardian_name: "Lamin Faal",
      guardian_tel: "+220823456719",
      address: "Gunjur, West Coast",
      status: "Transferred",
      color: "gray",
    },
    {
      id: "8",
      student_name: "Pa Modou Njie",
      student_id: "20252026008",
      gender: "Male",
      nationality: "Gambian",
      ethnicity: "Wolof",
      dob: "11/12/2008",
      class: "Grade 12A",
      section: "Senior",
      date_enrolled: "06/09/2014",
      guardian_name: "Isatou Njie",
      guardian_tel: "+220756891234",
      address: "Banjul, Banjul City",
      status: "Active",
      color: "green",
    },
    {
      id: "9",
      student_name: "Yassin Colley",
      student_id: "20252026009",
      gender: "Male",
      nationality: "Gambian",
      ethnicity: "Serahule",
      dob: "25/04/2010",
      class: "Grade 10C",
      section: "Senior",
      date_enrolled: "04/09/2016",
      guardian_name: "Adama Colley",
      guardian_tel: "+220887654321",
      address: "Sukuta, Kanifing",
      status: "Suspended",
      color: "yellow",
    },
    {
      id: "10",
      student_name: "Sirra Manneh",
      student_id: "20252026010",
      gender: "Female",
      nationality: "Gambian",
      ethnicity: "Mandinka",
      dob: "06/08/2008",
      class: "Grade 12B",
      section: "Senior",
      date_enrolled: "06/09/2014",
      guardian_name: "Buba Manneh",
      guardian_tel: "+220734128965",
      address: "Lamin, West Coast",
      status: "Active",
      color: "green",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold font-sans">STUDENTS DATA</h2>
          <p className="text-base-content/70">10 students shown</p>
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
            placeholder="search name, class, student ID"
            className="input input-bordered w-full  rounded-lg"
          />
        </div>
        <button className="btn btn-outline rounded-lg">Show all</button>
      </div>
      <div className=" rounded-lg shadow-md my-4">
        <div className="grid grid-cols-6 gap-4 md:gap-0 text-xs md:text-base text-base-content/60 px-2 py-2">
          <span>Student</span>
          <span>Class</span>
          <span>Section</span>
          <span>Guardian</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {STUDENT_DATA &&
          STUDENT_DATA.map((data) => {
            return <StudentData data={data} />;
          })}
      </div>
    </div>
  );
};

export default StudentsContent;
