import { Fragment, useState } from "react";

const AnnouncementButton = ({ message }) => {
  const [view, setView] = useState(false);
  const sentAt = message.sentAt
    ? new Date(message.sentAt).toLocaleString()
    : "Date unavailable";
  const recipients = message.recipients
    .map((recipient) =>
      recipient === "all"
        ? "All audiences"
        : recipient.charAt(0).toUpperCase() + recipient.slice(1),
    )
    .join(", ");

  return (
    <Fragment>
      <button
        onClick={() => setView(!view)}
        className="btn btn-ghost w-full flex justify-start py-2 border-t-2 border-r-2 border-t-primary border-r-primary"
      >
        <b>{message.subject}</b>... {sentAt}{" "}
        {view ? " " : "(read more...)"}
      </button>
      {view && (
        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <p>
              <b>From: </b>
              {message.author}
            </p>
            <p>
              <b>To: </b>
              {recipients}
            </p>
            <p>
              <b>Date: </b>
              {sentAt}
            </p>
            <p>
              <b>Subject: </b>
              {message.subject}
            </p>
          </div>
          <div className="mt-4 mb-8 pt-2">
            <p>{message.content}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AnnouncementButton;
