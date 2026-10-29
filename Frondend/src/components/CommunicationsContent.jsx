import { useEffect, useState } from "react";
import { FaBars, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router";
import {
  createAnnouncement,
  getAnnouncements,
} from "../utils/communicationApi";
import SentMessages from "./SentMessages";

const CommunicationsContent = ({ isOpen, setIsOpen }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let active = true;
    getAnnouncements()
      .then((announcements) => {
        if (active) setMessages(announcements);
      })
      .catch((loadFailure) => {
        if (active) setLoadError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSend = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSending(true);

    try {
      const announcement = await createAnnouncement({
        subject: subject.trim(),
        content: content.trim(),
        recipients: [recipient],
      });
      setMessages((current) => [announcement, ...current].slice(0, 8));
      setSubject("");
      setContent("");
      setRecipient("");
      setSuccess("Announcement sent successfully.");
    } catch (sendFailure) {
      setError(sendFailure.message);
    } finally {
      setIsSending(false);
    }
  };

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
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="rounded-md shadow-md p-2 self-start">
          <h2 className="font-bold">New announcement</h2>
          <form onSubmit={handleSend}>
            <div className="form-control">
              <label className="label" htmlFor="announcement-recipient">
                <span className="label-text">Send to</span>
              </label>
              <select
                id="announcement-recipient"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                className="select select-bordered rounded-md"
                required
              >
                <option value="" disabled>
                  Select a recipient group
                </option>
                <option value="guardians">Guardians</option>
                <option value="staff">Staff</option>
                <option value="students">Students</option>
                <option value="all">All audiences</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="announcement-subject">
                <span className="label-text">Subject</span>
              </label>
              <input
                id="announcement-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Term meeting"
                className="input input-bordered rounded-md"
                type="text"
                maxLength={200}
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="announcement-content">
                <span className="label-text">Message</span>
              </label>
              <textarea
                id="announcement-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="textarea textarea-bordered rounded-md h-32 max-h-32"
                placeholder="Write your message here..."
                required
              />
            </div>
            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}
            <div className="flex justify-end my-4">
              <button
                type="submit"
                disabled={isSending}
                className="btn btn-primary btn-sm rounded-md"
              >
                <FaPaperPlane />
                {isSending ? "Sending..." : "Send announcement"}
              </button>
            </div>
          </form>
        </div>
        <div className="p-2">
          <h2 className="font-bold">Most recently sent announcements</h2>
          {loadError && <p role="alert">{loadError}</p>}
          {isLoading ? (
            <p>Loading announcements...</p>
          ) : !messages.length && !loadError ? (
            <p>No announcements have been sent yet.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className="my-4 p-2 rounded-md shadow-md flex flex-col gap-4"
              >
                <SentMessages message={message} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationsContent;
