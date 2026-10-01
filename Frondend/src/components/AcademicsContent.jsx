import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClassesContent from "./ClassesContent";
import SubjectsContent from "./SubjectsContent";
import ExamsContent from "./ExamsContent";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";

const AcademicsContent = ({ isOpen, setIsOpen }) => {
  const [isActive, setIsActive] = useState("classes");
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold font-sans">ACADEMICS</h2>
            <p className="text-base-content/70">
              Classes, Subjects and Exams schedule
            </p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm rounded-md flex justify-center">
          {isActive === "classes" ? (
            <span className="flex items-center gap-1">
              <FaPlus />
              Add Class
            </span>
          ) : isActive === "subjects" ? (
            <span className="flex items-center gap-1">
              <FaPlus />
              Add Subject
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <FaPlus />
              Add Exam
            </span>
          )}
        </button>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="grid grid-cols-3 my-4">
        <button
          onClick={() => setIsActive("classes")}
          className={`border-b-2 ${isActive === "classes" ? "border-blue-950" : ""}`}
        >
          Classes
        </button>
        <button
          onClick={() => setIsActive("subjects")}
          className={`border-b-2 ${isActive === "subjects" ? "border-blue-950" : ""}`}
        >
          Subjects
        </button>
        <button
          onClick={() => setIsActive("exams")}
          className={`border-b-2 ${isActive === "exams" ? "border-blue-950" : ""}`}
        >
          Exams
        </button>
      </div>
      {isActive === "classes" ? (
        <ClassesContent />
      ) : isActive === "subjects" ? (
        <SubjectsContent />
      ) : (
        <ExamsContent />
      )}
    </div>
  );
};

export default AcademicsContent;
