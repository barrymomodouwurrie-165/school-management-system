import Messages from "./Messages";

const ChatMessages = ({ messages, subject, isLoading }) => {
  return (
    <div
      className="mb-4 max-h-[28rem] min-h-48 overflow-y-auto rounded-lg bg-base-200/50 p-3 sm:p-5"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label="Study coach conversation"
    >
      {!messages.length ? (
        <div className="flex min-h-40 flex-col items-center justify-center text-center">
          <p className="font-semibold">Ready to study {subject}?</p>
          <p className="mt-1 text-sm text-base-content/70">
            Ask for an explanation, an example, or switch to Practice quiz.
          </p>
        </div>
      ) : (
        messages.map((item) => (
          <Messages
            key={item.id}
            sender={item.sender}
            text={item.text}
            time={item.time}
          />
        ))
      )}
      {isLoading && (
        <p role="status" className="my-3 text-sm text-base-content/70">
          The study coach is preparing a response...
        </p>
      )}
    </div>
  );
};

export default ChatMessages;
