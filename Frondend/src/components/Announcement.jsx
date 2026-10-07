const Announcement = ({ messages }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mx-auto py-2 px-5 shadow-md rounded-md">
        <h2>Announcements</h2>
        <div className="flex flex-col py-4 gap-6 md:gap-1">
          {messages &&
            messages.map((message) => {
              return (
                <button className="btn btn-ghost w-full flex justify-start py-2 border-t-2 border-r-2 border-t-primary border-r-primary">
                  <b>{message.subject}</b>... {message.date}, 2026. (read more...)
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
