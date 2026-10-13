import { FaExclamationCircle, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
const ReportStudent = () => {
  const [idName, setIdName] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState(false);
  const [counselor, setCounselor] = useState(false);
  const [reports, setReports] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = dayjs().format("ddd, D MMM YYYY hh:mm A");
    const newReport = {
      id: crypto.randomUUID(),
      studentIdentity: idName,
      category,
      urgency,
      description,
      involveGuardian: parent ? "Yes" : "No",
      involveCounselor: counselor ? "Yes" : "No",
      date,
    };
    setReports((prev) => [newReport, prev]);
    setIdName("");
    setCategory("");
    setUrgency("");
    setDescription("");
    setParent(false);
    setCounselor(false);
  };
  console.log(reports);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-1 rounded-md shadow-md px-2 pb-2">
        <p className="text-base-content/70">Academic Session: 2024/2025</p>
        <p className="Text-lg text-blue-600">Report a Student</p>
        <p className="text-base-content/70 text-sm md:text-base">
          Submit behavioural, academic, or attendance reports directly to the
          school administration.
        </p>
      </div>
      <div className="my-4 px-2 pb-4 rounded-md shadow-md">
        <form action="">
          <div className="form-control max-w-md">
            <label className="label" htmlFor="">
              <span className="label-text w-full flex items-center justify-between">
                <p>Name of Student *</p>
                <p className="font-bold text-blue-600">REQUIRED</p>
              </span>
            </label>
            <input
              onChange={(e) => setIdName(e.target.value)}
              value={idName}
              placeholder="write student's ID or name"
              className="input input-bordered inout-sm rounded-md"
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 max-w-md">
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Report Category *</span>
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="select select-bordered rounded-md select-sm"
                name=""
                id=""
              >
                <option value="Behaviour">Behaviour</option>
                <option value="Academic">Academic</option>
                <option value="Attendance">Attendance</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Incident Urgency</span>
              </label>
              <select
                onChange={(e) => setUrgency(e.target.value)}
                value={urgency}
                className="select select-ghost select-sm rounded-md bg-blue-600 text-white"
                name=""
                id=""
              >
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Very Urgent">Very Urgent</option>
              </select>
            </div>
          </div>
          <div className="form-control max-w-md">
            <label className="label" htmlFor="">
              <span className="label-text w-full flex items-center justify-between">
                <p>Describe what happened *</p>
                <p className="text-blue-600">500 words max</p>
              </span>
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Describe what happened in detail (Observation, incident time, context, any immediate intervnetions taken)..."
              className="textarea textarea-bordered rounded-md max-w-md min-h-52"
              name=""
              id=""
            />
          </div>
          <span className="flex items-center my-2 max-w-md">
            <FaExclamationCircle className="text-red-600 mr-2" />
            <p className="text-base-content/70">
              Statements are permanently recorded and routed instantly to the
              Head of Year.
            </p>
          </span>
          <div className="flex items-center justify-between max-w-md">
            <div className="form-control flex flex-row gap-1 items-center">
              <input
                onChange={(e) => setParent(e.target.checked)}
                value={parent}
                type="checkbox"
                name=""
                id=""
              />{" "}
              <label className="label" htmlFor="">
                {" "}
                <span className="label-text">
                  Recommend Parent/Guardian notification
                </span>
              </label>
            </div>
            <div className="form-control flex flex-row gap-1 items-center">
              <input
                onChange={(e) => setCounselor(e.target.checked)}
                value={counselor}
                type="checkbox"
                name=""
                id=""
              />{" "}
              <label className="label" htmlFor="">
                {" "}
                <span className="label-text">
                  Request Guidance Counselor triage
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end max-w-md my-2">
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-sm rounded-md"
            >
              Submit report <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportStudent;
