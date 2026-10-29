import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClassesContent from "./ClassesContent";
import SubjectsContent from "./SubjectsContent";
import ExamsContent from "./ExamsContent";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";

const AcademicsContent = ({ isOpen, setIsOpen }) => {
  const [addButton, setAddButton] = useState("");
  const [isActive, setIsActive] = useState("classes");

  const handleAddButton = () => {
    if (isActive === "classes") setAddButton("addClass");
    if (isActive === "exams") setAddButton("addExam");
  };
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
        <button
          type="button"
          onClick={handleAddButton}
          disabled={isActive === "subjects"}
          title={
            isActive === "classes"
              ? "Create a classroom"
              : isActive === "exams"
                ? "Create an exam"
                : "Subjects are pending database setup"
          }
          className="btn btn-primary btn-sm flex justify-center rounded-md"
        >
          <span className="flex items-center gap-1">
            {isActive === "classes" ? (
              <>
                <FaPlus />
                Add Class
              </>
            ) : isActive === "subjects" ? (
              "Subjects pending database setup"
            ) : (
              <>
                <FaPlus />
                Add Exam
              </>
            )}
          </span>
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
          onClick={() => {
            setIsActive("classes");
            setAddButton("");
          }}
          className={`border-b-2 ${isActive === "classes" ? "border-blue-950" : ""}`}
        >
          Classes
        </button>
        <button
          onClick={() => {
            setIsActive("subjects");
            setAddButton("");
          }}
          className={`border-b-2 ${isActive === "subjects" ? "border-blue-950" : ""}`}
        >
          Subjects
        </button>
        <button
          onClick={() => {
            setIsActive("exams");
            setAddButton("");
          }}
          className={`border-b-2 ${isActive === "exams" ? "border-blue-950" : ""}`}
        >
          Exams
        </button>
      </div>
      {isActive === "classes" ? (
        <ClassesContent addButton={addButton} setAddButton={setAddButton} />
      ) : isActive === "subjects" ? (
        <SubjectsContent addButton={addButton} setAddButton={setAddButton} />
      ) : (
        <ExamsContent addButton={addButton} setAddButton={setAddButton} />
      )}
    </div>
  );
};

export default AcademicsContent;
