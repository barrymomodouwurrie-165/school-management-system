import { useState } from "react";

const ClassesContent = ({ addButton, setAddButton }) => {
  const [classes, setClasses] = useState([
    {
      id: "1",
      class: "Grade 7A",
      section: "Junior",
      class_teacher: "Mr. A.Jallow",
      total_students: "60",
    },
    {
      id: "2",
      class: "Grade 7B",
      section: "Junior",
      class_teacher: "Ms. A.Njie",
      total_students: "58",
    },
    {
      id: "3",
      class: "Grade 8A",
      section: "Junior",
      class_teacher: "Mr. N.Mendy",
      total_students: "60",
    },
    {
      id: "4",
      class: "Grade 8B",
      section: "Junior",
      class_teacher: "Mr. K.Samba",
      total_students: "55",
    },
    {
      id: "5",
      class: "Grade 9A",
      section: "Junior",
      class_teacher: "Ms. Z.Manga",
      total_students: "60",
    },
  ]);
  //   const [addedClass, setAddedClass] = useState({});
  const [classs, setClasss] = useState("");
  const [section, setSection] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState("");

  const handleSubit = (e) => {
    e.preventDefault();
    const newClass = {
      id: crypto.randomUUID(),
      class: classs,
      section: section,
      class_teacher: teacher,
      total_students: students,
    };
    setClasses((prev) => [...prev, newClass]);
    setClasss("");
    setSection("");
    setTeacher("");
    setStudents("");
    setAddButton("");
  };

  return addButton === "addClass" ? (
    <div className="rounded-md shadow-md p-4">
      <form action="">
        <div className="form-control">
          <label className="label" htmlFor="">
            <span>Class Name</span>
          </label>
          <input
            onChange={(e) => setClasss(e.target.value)}
            value={classs}
            className="input input-bordered rounded-md input-sm w-1/3"
            type="text"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span>Section</span>
          </label>
          <select
            onChange={(e) => {
              setSection(e.target.value);
            }}
            value={section}
            className="select select-bordered rounded-md select-sm w-1/3"
            name=""
            id=""
          >
            <option value="">Select</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span>Class Teacher</span>
          </label>
          <input
            onChange={(e) => setTeacher(e.target.value)}
            value={teacher}
            className="input input-bordered rounded-md input-sm w-1/3"
            type="text"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="">
            <span>Number of Students</span>
          </label>
          <input
            onChange={(e) => setStudents(e.target.value)}
            value={students}
            className="input input-bordered rounded-md input-sm w-1/3"
            type="number"
          />
        </div>
        <div className="my-2">
          <button
            onClick={handleSubit}
            className="btn btn-primary btn-sm rounded-md"
          >
            Add to Classes
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="rounded-md shadow-md">
      <div className="grid grid-cols-4 text-base-content/70 text-sm m-2">
        <span>CLASS</span>
        <span>SECTION</span>
        <span>CLASS TEACHER</span>
        <span>#STUDENTS</span>
      </div>

      {classes &&
        classes.map((data) => {
          return (
            <div
              key={data.id}
              className="grid grid-cols-4 text-sm border-t p-2"
            >
              <span>{data.class}</span>
              <span>{data.section}</span>
              <span>{data.class_teacher}</span>
              <span className="flex justify-center md:justify-start">
                {data.total_students}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default ClassesContent;
