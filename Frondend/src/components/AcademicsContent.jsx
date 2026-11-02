import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClassesContent from "./ClassesContent";
import SubjectsContent from "./SubjectsContent";
import ExamsContent from "./ExamsContent";
import AdminResults from "./AdminResults";
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
              Classes, Subjects, Exams, and Results
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddButton}
          disabled={isActive === "subjects" || isActive === "results"}
          title={
            isActive === "classes"
              ? "Create a classroom"
              : isActive === "exams"
                ? "Create an exam"
                : isActive === "subjects"
                  ? "Subjects are managed in the curriculum catalog"
                  : "Results are published below"
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
              "Curriculum catalog"
            ) : isActive === "results" ? (
              "Results"
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
      <div className="my-4 grid grid-cols-2 sm:grid-cols-4">
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
        <button
          onClick={() => {
            setIsActive("results");
            setAddButton("");
          }}
          className={`border-b-2 ${isActive === "results" ? "border-blue-950" : ""}`}
        >
          Results
        </button>
      </div>
      {isActive === "classes" ? (
        <ClassesContent addButton={addButton} setAddButton={setAddButton} />
      ) : isActive === "subjects" ? (
        <SubjectsContent addButton={addButton} setAddButton={setAddButton} />
      ) : isActive === "exams" ? (
        <ExamsContent addButton={addButton} setAddButton={setAddButton} />
      ) : (
        <AdminResults />
      )}
    </div>
  );
};

export default AcademicsContent;
