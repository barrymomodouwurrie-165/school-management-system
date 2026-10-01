import { FaPaperPlane } from "react-icons/fa";
import SentMessages from "./SentMessages";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";
const CommunicationsContent = ({ isOpen, setIsOpen }) => {
  const MESSAGES = [
    {
      id: "1",
      send_from: "Admin",
      subject: "Parent meeting for the junior school",
      text: "Please join us on Friday 4 pm to discuss term progress.",
      send_to: "Guardians",
      date: "Sep 24",
    },
    {
      id: "2",
      send_from: "Admin",
      subject: "School closed on public holiday",
      text: "School will be closed on Monday and will reopen on Tuesday.",
      send_to: "All",
      date: "Sep 20",
    },
    {
      id: "3",
      send_from: "Admin",
      subject: "Staff briefing before first period",
      text: "A short briefing will be held in the hall before first period on Wednesday.",
      send_to: "Staff",
      date: "Sep 18",
    },
  ];
  return (
    <div className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold font-sans">COMMUNICATIONS</h2>
          <p className="text-sm text-base-content/70">
            Send announcements to guardians, staff and students
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="rounded-md shadow-md p-2 self-start">
          <h2 className="font-bold">New announcement</h2>
          <form action="">
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">From</span>
              </label>
              <input className="input input-bordered rounded-md " type="text" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Send to</span>
              </label>
              <select
                className="select select-bordered rounded-md "
                name="send_to"
                id=""
              >
                <option value="Guardians">Guardians</option>
                <option value="Staff">Staff</option>
                <option value="Students">Students</option>
                <option value="All">All</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Subject</span>
              </label>
              <input
                placeholder="eg. Term meeting"
                className="input input-bordered rounded-md "
                type="text"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Message</span>
              </label>
              <textarea
                className="input input-bordered rounded-md  h-32 max-h-32"
                type="text"
                placeholder="write your message here..."
              />
            </div>
          </form>
          <div className="flex justify-end my-4">
            <button className="btn btn-primary btn-sm rounded-md">
              <FaPaperPlane />
              Send announcement
            </button>
          </div>
        </div>
        <div className="p-2">
          <h2 className="font-bold">Most recently sent announcements</h2>
          {MESSAGES &&
            MESSAGES.map((message) => {
              return <SentMessages message={message} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default CommunicationsContent;
