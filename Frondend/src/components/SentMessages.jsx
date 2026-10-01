import { useState } from "react";

const SentMessages = ({ message }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    send_from: message.send_from,
    send_to: message.send_to,
    subject: message.subject,
    text: message.text,
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div
      key={message.id}
      className="my-4 p-2 rounded-md shadow-md flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-bold">{message.send_from}</span>
          <span className="font-bold text-sm">{message.subject}</span>
        </div>
        <span className="text-base-content/70 text-sm">{message.date}</span>
      </div>
      <p className="text-base-content/70">{message.text}</p>
      <div className="flex items-center justify-between">
        <span className="border-2 rounded-3xl min-w-24 max-w-32 flex justify-center items-center text-sm">
          {message.send_to}
        </span>
        <button
          onClick={() => setIsEdit(!isEdit)}
          className="btn btn-outline btn-sm rounded-md"
        >
          Edit Message
        </button>
      </div>
      {isEdit && (
        <div>
          <form action="">
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">From</span>
              </label>
              <input
                onChange={update}
                value={form.send_from}
                className="input input-bordered rounded-md "
                type="text"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text">Send to</span>
              </label>
              <select
                onChange={update}
                value={form.send_to}
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
                onChange={update}
                value={form.subject}
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
                value={form.text}
                onChange={update}
              />
            </div>
          </form>
          <div className="flex justify-end my-4">
            <button className="btn btn-primary btn-sm rounded-md">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentMessages;
