import { useState } from "react";

const ExamsContent = ({ addButton, setAddButton }) => {
  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [section, setSection] = useState("");

  const status = "Scheduled";

  const [exams, setExams] = useState([
    {
      id: "1",
      exam: "First term Exam",
      exam_date: "15th Nov to 5th Dec",
      section: "Both",
      status: "Scheduled",
      color: "blue",
    },
    {
      id: "2",
      exam: "Grade 9 trial Exam",
      exam_date: "1st April to 12th April",
      section: "Junior",
      status: "Scheduled",
      color: "blue",
    },

    {
      id: "3",
      exam: "End of Second Term Exam",
      exam_date: "16th July to 26th july",
      section: "Both",
      status: "Completed",
      color: "green",
    },
    {
      id: "4",
      exam: "G12 Trials Examination",
      exam_date: "5th April to 12th April",
      section: "Senior",
      status: "Completed",
      color: "green",
    },
    {
      id: "5",
      exam: "WASSCE",
      exam_date: "May 19 to June 30",
      section: "Senior",
      status: "Completed",
      color: "green",
    },
  ]);

  const handleSubmitExam = (e) => {
    e.preventDefault();
    const newExam = {
      id: crypto.randomUUID(),
      exam: examTitle,
      exam_date: examDate,
      section: section,
      status: status,
      color: "blue",
    };
    setExams((prev) => [newExam, ...prev]);
    setExamTitle("");
    setExamDate("");
    setSection("");
    setAddButton("");
  };

  return addButton === "addExam" ? (
    <div className="rounded-md shadow-md p-2 m-2">
      <form action="">
        <div className="form-control">
          <label className="label" htmlFor="">
            <span className="label-text">Exam Title</span>
          </label>
          <input
            onChange={(e) => setExamTitle(e.target.value)}
            value={examTitle}
            className="input input-bordered rounded-md input-sm w-full md:w-1/3"
            type="text"
            name=""
            id=""
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span className="label-text">Exam duration</span>
          </label>
          <input
            onChange={(e) => setExamDate(e.target.value)}
            value={examDate}
            placeholder="eg. May 2nd to June 30th"
            className="input input-bordered rounded-md input-sm w-full md:w-1/3"
            type="text"
            name=""
            id=""
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span className="label-text">Section</span>
          </label>
          <select
            onChange={(e) => setSection(e.target.value)}
            value={section}
            className="select select-bordered rounded-md select-sm w-full md:w-1/3"
            name=""
            id=""
          >
            <option value="">--Select--</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span className="label-text">Exam status</span>
          </label>
          <input
            readOnly
            value={status}
            className="input input-bordered rounded-md input-sm w-full md:w-1/3"
            type="text"
            name=""
            id=""
          />
        </div>
        <div className="flex items-center justify-between md:justify-normal gap-28 my-2">
          <button
            onClick={handleSubmitExam}
            className="btn btn-primary btn-sm rounded-md"
          >
            Add to Exams
          </button>
          <button
            onClick={() => setAddButton("")}
            className="btn btn-primary btn-sm rounded-md"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="rounded-md shadow-md p-2 m-2">
      <div className="grid grid-cols-4 text-base-content/70 text-sm m-2">
        <span>EXAM</span>
        <span>DATES</span>
        <span>SECTION</span>
        <span>STATUS</span>
      </div>
      {exams &&
        exams.map((data) => {
          return (
            <div
              key={data.id}
              className="grid grid-cols-4 gap-6 md:gap-0 text-xs md:text-sm border-t p-2"
            >
              <span>{data.exam}</span>
              <span>{data.exam_date}</span>
              <span>{data.section}</span>
              <span
                className={`bg-${data.color}-600 max-w-24 max-h-6 flex justify-center items-center rounded-md text-white`}
              >
                {data.status}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default ExamsContent;
