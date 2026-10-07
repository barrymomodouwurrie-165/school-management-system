import { Fragment, useState } from "react";

const AnnouncementButton = ({ message }) => {
  const [view, setView] = useState(false);
  return (
    <Fragment>
      <button
        onClick={() => setView(!view)}
        className="btn btn-ghost w-full flex justify-start py-2 border-t-2 border-r-2 border-t-primary border-r-primary"
      >
        <b>{message.subject}</b>... {message.date}, 2026. (read more...)
      </button>
      {view && (
        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <p>
              <b>From: </b>
              {message.send_from}
            </p>
            <p>
              <b>To: </b>
              {message.send_to}
            </p>
            <p>
              <b>Date: </b>
              {message.date}
            </p>
            <p>
              <b>Subject: </b>
              {message.subject}
            </p>
          </div>
          <div className="mt-4 pt-2">
            <p>{message.text}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AnnouncementButton;
