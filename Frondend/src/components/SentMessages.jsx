const formatRecipients = (recipients = []) =>
  recipients
    .map((recipient) =>
      recipient === "all"
        ? "All audiences"
        : recipient.charAt(0).toUpperCase() + recipient.slice(1),
    )
    .join(", ");

const SentMessages = ({ message }) => {
  const sentAt = message.sentAt
    ? new Date(message.sentAt).toLocaleString()
    : "Date unavailable";

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-bold">{message.author}</span>
          <span className="font-bold text-sm">{message.subject}</span>
        </div>
        <span className="text-base-content/70 text-sm">{sentAt}</span>
      </div>
      <p className="text-base-content/70">{message.content}</p>
      <span className="border-2 rounded-3xl min-w-24 max-w-48 px-3 flex justify-center items-center text-sm self-start">
        {formatRecipients(message.recipients)}
      </span>
    </>
  );
};

export default SentMessages;
