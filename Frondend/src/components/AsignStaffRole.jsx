import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const AsignStaffRole = ({ assign, setAssign, staffName, staffId }) => {
  const QUALIFICATIONS_ITEMS = [
    "PTC",
    "HTC",
    "Diploma",
    "BSc Degree",
    "Master's Degree",
    "PhD",
  ];
  const SUBJECTS = [
    "Mathematics",
    "English Language",
    "G.Science",
    "Civic",
    "Agricultural Science",
    "F.Accounting",
    "C.Accounting",
    "Physics",
    "Government",
    "History",
    "Geogrpahy",
    "Biology",
    "Chemistry",
    "S.E.S",
    "Literature",
    "I.R.k",
  ];
  const CLASSES = [
    "7A",
    "7B",
    "7C",
    "8A",
    "8B",
    "8C",
    "9A",
    "9B",
    "9C",
    "10A",
    "10B",
    "11A",
    "11B",
    "12A",
    "12B",
  ];
  const [selected, setSelected] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [classSelected, setClassSelected] = useState("");
  const [classes, setClasses] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);

  const HandleQualificationChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    setQualifications((prev) =>
      prev.includes(value) ? prev : [...prev, value],
    );
    setSelected("");
  };
  const RemoveQualification = (item) => {
    setQualifications((prev) => prev.filter((q) => q !== item));
  };

  const HandleSubjectChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    setSubjects((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSubjectSelected("");
  };
  const RemoveSubject = (item) => {
    setSubjects((prev) => prev.filter((q) => q !== item));
  };
  const HandleClassChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    setClasses((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setAssigned("");

    setClassSelected("");
  };
  const RemoveClass = (item) => {
    setClasses((prev) => prev.filter((q) => q !== item));
  };
  const HandleAssignedClassChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    setAssignedClasses((prev) =>
      prev.includes(value) ? prev : [...prev, value],
    );

    setAssigned("");
  };
  const RemoveAssignedClass = (item) => {
    setAssignedClasses((prev) => prev.filter((q) => q !== item));
  };

  return (
    <div className="max-w-3xl m-auto p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">
          Add to {staffName}({staffId}) profile
        </h2>
        <button
          className="btn btn-primary btn-sm rounded-md"
          onClick={() => setAssign(!assign)}
        >
          back
        </button>
      </div>
      <div className="my-4 shadow-md rounded-md p-4 max-w-3xl m-auto">
        <h2 className="font-bold mb-4">Add Qualification(s)</h2>

        <select
          onChange={HandleQualificationChange}
          value={selected}
          className="select select-bordered select-sm rounded-md"
          name=""
          id=""
        >
          <option value="">Select</option>
          {QUALIFICATIONS_ITEMS.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex items-center gap-2 mt-4">
          {qualifications.length === 0 && (
            <p className="text-base-content/70">No qualifications selected!</p>
          )}
          {qualifications.map((item) => {
            return (
              <div key={item} className="">
                <span className="relative border bg-green-600/10 p-1 rounded-md min-w-20 flex justify-center">
                  {item}
                  <button
                    onClick={() => {
                      RemoveQualification(item);
                    }}
                    className="absolute top-0 left-[88%] text-red-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="my-4 shadow-md rounded-md p-4 max-w-3xl m-auto">
        <h2 className="font-bold mb-4">Assign Subject(s)</h2>
        <select
          onChange={HandleSubjectChange}
          value={subjectSelected}
          className="select select-bordered select-sm rounded-md"
          name=""
          id=""
        >
          <option value="">Select</option>
          {SUBJECTS.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex items-center gap-2 mt-4">
          {subjects.length === 0 && (
            <p className="text-base-content/70">No subject selected yet!</p>
          )}
          {subjects &&
            subjects.map((item) => {
              return (
                <span className="relative border bg-green-600/10 p-1 rounded-md min-w-20 flex justify-center">
                  {item}
                  <button
                    onClick={() => {
                      RemoveSubject(item);
                    }}
                    className="absolute top-0 left-[88%] text-red-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              );
            })}
        </div>
      </div>
      <div className="my-4 shadow-md rounded-md p-4 max-w-3xl m-auto">
        <h2 className="font-bold mb-4">Assign Class(es)</h2>
        <select
          onChange={HandleClassChange}
          value={classSelected}
          className="select select-bordered select-sm rounded-md"
          name=""
          id=""
        >
          <option value="">Select</option>
          {CLASSES.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex items-center gap-2 mt-4">
          {classes.length === 0 && (
            <p className="text-base-content/70">No class selected yet!</p>
          )}
          {classes &&
            classes.map((item) => {
              return (
                <span className="relative border bg-green-600/10 p-1 rounded-md min-w-20 flex justify-center">
                  {item}
                  <button
                    onClick={() => {
                      RemoveClass(item);
                    }}
                    className="absolute top-0 left-[88%] text-red-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              );
            })}
        </div>
      </div>
      <div className="my-4 shadow-md rounded-md p-4 max-w-3xl m-auto">
        <h2 className="font-bold mb-4">Make class teacher</h2>
        <select
          onChange={HandleAssignedClassChange}
          value={assigned}
          className="select select-bordered select-sm rounded-md"
          name=""
          id=""
        >
          <option value="">Select</option>
          {CLASSES.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex items-center gap-2 mt-4">
          {assignedClasses.length === 0 && (
            <p className="text-base-content/70">No class selected yet!</p>
          )}
          {assignedClasses &&
            assignedClasses.map((item) => {
              return (
                <span className="relative border bg-green-600/10 p-1 rounded-md min-w-20 flex justify-center">
                  {item}
                  <button
                    onClick={() => {
                      RemoveAssignedClass(item);
                    }}
                    className="absolute top-0 left-[88%] text-red-600"
                  >
                    <FaTimes />
                  </button>
                </span>
              );
            })}
        </div>
      </div>
      <div>
        <button className="btn btn-primary btn-sm rounded-md shadow-md">Add to profile</button>
      </div>
    </div>
  );
};

export default AsignStaffRole;
