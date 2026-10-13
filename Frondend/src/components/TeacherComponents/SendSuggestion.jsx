import { FaPen, FaQuestion, FaLockOpen, FaPaperPlane } from "react-icons/fa";
const SendSuggestion = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-1 rounded-md shadow-md px-2 pb-2">
        <p className="text-base-content/70">Academic Session: 2024/2025</p>
        <p className="Text-lg text-blue-600">Send Suggestions</p>
        <p className="text-base-content/70 text-sm md:text-base">
          Share constructive ideas and recommendations to improve school
          operations, curriculum or school environment life.
        </p>
      </div>
      <div className="rounded-md px-2 py-4 shadow-md">
        <div className="flex items-center justify-between max-w-xl text-sm md:text-base">
          <span className="outline outline-1 text-blue-600 outline-blue-600 p-1 flex items-center gap-1">
            <FaPen size={12} /> Draft Proposition
          </span>
          <span className="p-1 bg-blue-600/10 text-blue-600 rounded-md">
            CONFIDENTIAL FLOW
          </span>
        </div>
        <form action="">
          <div className="form-control max-w-40 py-2">
            <label className="label" htmlFor="">
              <span className="label-text">Category / Topic Area</span>
            </label>
            <select
              className="select select-ghost bg-blue-600/10 text-blue-600 select-sm"
              name=""
              id=""
            >
              <option value="Curriculum">Curriculum</option>
              <option value="Facilities & Infrastructure">
                Facilities & Infrastructure
              </option>
              <option value="Staff Welfare">Staff Welfare</option>
              <option value="Student Activities">Student Activities</option>
              <option value="ICT & TECH">ICT & TECH</option>
            </select>
          </div>
          <div className="form-control max-w-lg py-2">
            <label className="label" htmlFor="">
              <span className="label-text">Initiative Headline</span>
            </label>
            <input
              placeholder="e.g., Extended Library Operating Hours During Mid-Terms"
              className="input input-bordered input-sm rounded-md"
              type="text"
              name=""
              id=""
            />
          </div>
          <div className="form-control max-w-lg">
            <label className="label" htmlFor="">
              <span className="label-text w-full flex items-center justify-between">
                <p>Detailed suggestion & Expected Impact</p>
                <p className="text-blue-600">600 words</p>
              </span>
            </label>
            <textarea
              placeholder="Share an idea to improve the school(e.e., Proposed resource upgrades, timetable adjustments, extracurricular programs)..."
              className="textarea textarea-bordered rounded-md max-w-lg min-h-52"
              name=""
              id=""
            />
            <p className="text-sm text-blue-600/70">
              Be specific about the department, logistical requirements, and
              expected academic or social returns.
            </p>
          </div>
          <div className="form-control max-w-lg my-2 px-2 py-2 bg-blue-600/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full p-1 bg-white">
                <FaQuestion />
              </span>
              <div className="flex flex-col text-sm md:text-base">
                <p>Include my name (Mr. N.A Mendy)</p>
                <p className="text-blue-600/70">
                  Your credentials will accompany this submission to the
                  academic committee
                </p>
              </div>
              <input
                className="checkbox-lg md:checkbox-md mr-4"
                type="checkbox"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 my-4 max-w-lg">
            <span className="flex items-center gap-2 text-sm md:text-base text-base-content/70">
              <FaLockOpen />{" "}
              <p>Reviewed every Monday by Administrative Board</p>
            </span>
            <div className="flex items-center justify-between gap-2 mt-4">
              <button className="btn btn-outline btn-sm rounded-md">
                Discard
              </button>
              <button className="btn btn-primary btn-sm rounded-md">
                Send Suggestion <FaPaperPlane />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendSuggestion;
