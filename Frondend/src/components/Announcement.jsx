import { useEffect, useState } from "react";
import { getAnnouncements } from "../utils/communicationApi";
import AnnouncementButton from "./AnnouncementButton";

const Announcement = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAnnouncements()
      .then((announcements) => {
        if (active) setMessages(announcements);
      })
      .catch((loadFailure) => {
        if (active) setError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mx-auto py-2 px-5 shadow-md rounded-md">
        <h2>Announcements</h2>
        {error && <p role="alert">{error}</p>}
        {isLoading ? (
          <p>Loading announcements...</p>
        ) : !messages.length && !error ? (
          <p>No announcements for your account.</p>
        ) : (
          <div className="flex flex-col py-4 gap-6 md:gap-1">
            {messages.map((message) => (
              <AnnouncementButton key={message._id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement;
