import { FaEye, FaPen } from "react-icons/fa";
import { Link } from "react-router";

const StudentsContent = () => {
  const STUDENT_DATA = [
    {
      id: "1",
      student_name: "Aminate Bah",
      student_id: "20252026001",
      class: "Grade 7A",
      section: "Junior",
      guardian_name: "Fatou Bah",
      status: "Active",
      color: "green",
    },
    {
      id: "2",
      student_name: "Ebrima Sanneh",
      student_id: "20252026002",
      class: "Grade 7A",
      section: "Junior",
      guardian_name: "Ousman Sanneh",
      status: "Active",
      color: "green",
    },
    {
      id: "3",
      student_name: "Haddy Jallow",
      student_id: "20252026003",
      class: "Grade 7B",
      section: "Junior",
      guardian_name: "Mariama Jallow",
      status: "Active",
      color: "green",
    },
    {
      id: "4",
      student_name: "Momodou Ceesay",
      student_id: "20252026004",
      class: "Grade 7B",
      section: "Junior",
      guardian_name: "Alieu Ceesay",
      status: "Suspended",
      color: "yellow",
    },
    {
      id: "5",
      student_name: "Fatoumata Jobe",
      student_id: "20252026005",
      class: "Grade 10A",
      section: "Senior",
      guardian_name: "Binta Jobe",
      status: "Active",
      color: "green",
    },
    {
      id: "6",
      student_name: "Karamo Touray",
      student_id: "20252026006",
      class: "Grade 10A",
      section: "Senior",
      guardian_name: "Sarjo Touray",
      status: "Active",
      color: "green",
    },
    {
      id: "7",
      student_name: "Ndey Faal",
      student_id: "20252026007",
      class: "Grade 11B",
      section: "Senior",
      guardian_name: "Lamin Faal",
      status: "Transferred",
      color: "",
    },
    {
      id: "8",
      student_name: "Pa Modou Njie",
      student_id: "20252026008",
      class: "Grade 12A",
      section: "Senior",
      guardian_name: "Isatou Njie",
      status: "Active",
      color: "green",
    },
    {
      id: "9",
      student_name: "Yassin Colley",
      student_id: "20252026009",
      class: "Grade 10C",
      section: "Senior",
      guardian_name: "Adama Colley",
      status: "Suspended",
      color: "yellow",
    },
    {
      id: "10",
      student_name: "Sirra Manneh",
      student_id: "20252026010",
      class: "Grade 12B",
      section: "Senior",
      guardian_name: "Buba Manneh",
      status: "Active",
      color: "green",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-bold font-sans">STUDENTS DATA</h2>
        <p className="text-base-content/70">10 students shown</p>
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
        <div className="grid grid-cols-6 text-base-content/60 px-2 py-2">
          <span>Student</span>
          <span>Class</span>
          <span>Section</span>
          <span>Guardian</span>
          <span>Status</span>
          <span>Action</span>
              </div>
              {STUDENT_DATA && STUDENT_DATA.map((data) => {
                      return (
                        <div
                          key={data.id}
                          className="grid grid-cols-6 gap-2 px-2 py-3 border-t"
                        >
                          <div className="flex flex-col">
                            <span className="">{data.student_name}</span>
                            <span className="text-base-content/70">
                              {data.student_id}
                            </span>
                          </div>
                          <span className="ml-3 md:ml-0">{data.class}</span>
                          <span>{data.section}</span>
                          <span>{data.guardian_name}</span>
                          <div
                            className={`${data.color === "green" ? "bg-green-600" : "bg-red-600"} flex justify-center w-[80px] h-[25px] md:w-[100px]  md:h-[25px] rounded-md text-sm text-white`}
                          >
                            {data.status}
                          </div>
                          <div className="flex items-start justify-end gap-4 md:flex-col md:justify-start">
                            <Link className="max-w-[20px]">
                              <FaEye size={12} />
                            </Link>
                            <Link className="max-w-[20px]">
                              <FaPen size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                  })}
      </div>
    </div>
  );
};

export default StudentsContent;
