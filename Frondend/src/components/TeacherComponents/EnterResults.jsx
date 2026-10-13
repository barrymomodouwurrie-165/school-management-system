import ClassesResults from "./ClassesResults";
import { FaSdCard } from "react-icons/fa";
const EnterResults = () => {
  const STUDENTS_DATA = [
    {
      id: "001",
      name: "Fatoumatta Jobe",
    },
    {
      id: "002",
      name: "Bubacarr Jallow",
    },
    {
      id: "003",
      name: "Ousman Saine",
    },
    {
      id: "004",
      name: "Mariama Bah",
    },
    {
      id: "005",
      name: "Mustapha Colley",
    },
  ];
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-2 rounded-md shadow-md px-2 pb-3 mb-4">
        <p className="text-sm md:text-bas mb-2">ACADEMIC SESSION: 2025/26</p>
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-lg font-bold text-blue-600">
            Enter Results
          </h2>
          <span className="text-xs md:text-base bg-blue-600/10 px-2 py-1 rounded-xl">
            Grading Scale: Standard(A:80+, B:70+, C:60+, D:50+, E:40+,
            F:&#60;39)
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-md shadow-md px-2 pb-3 my-2">
        <div className="flex flex-col gap-2">
          <p className="text-base-content/70 text-xs md:text-base">
            ASSIGNED CLASS
          </p>
          <span className="bg-blue-600/5 rounded-md max-w-36">
            <select
              className="select select-ghost select-sm rounded-md"
              name=""
              id=""
            >
              <option value="Grade 10 A">Grade 10 A</option>
              <option value="Grade 11 A">Grade 11 A</option>
            </select>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base-content/70 text-xs md:text-base">
            EVALUATION PERIOD
          </p>
          <span className="bg-blue-600/5 rounded-md max-w-36">
            <select
              className="select select-ghost select-sm rounded-md"
              name=""
              id=""
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base-content/70 text-xs md:text-base">SUBJECT</p>
          <span className="bg-blue-600/5 rounded-md max-w-36">
            <select
              className="select select-ghost select-sm rounded-md"
              name=""
              id=""
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </span>
        </div>
      </div>
      <div className="shadow-md">
        <div className="grid grid-cols-5 text-xs md:text-base px-2 py-4 bg-blue-600/20 rounded-t-md">
          <span>ID</span>
          <span>NAME</span>
          <span>TEST(30%)</span>
          <span>EXAM(70%)</span>
          <span className="">TOTAL MARK(100%)</span>
        </div>
        {STUDENTS_DATA &&
          STUDENTS_DATA.map((data) => {
            return <ClassesResults key={data.id} data={data} />;
          })}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button className="btn btn-primary btn-sm rounded-md">
          <FaSdCard className="text-white" />
          Save Marks
        </button>
        <span className="text-sm md:text-base text-base-content/70">
          Last Entered: 05/10/2026, 12:35 PM
        </span>
      </div>
    </div>
  );
};

export default EnterResults;
