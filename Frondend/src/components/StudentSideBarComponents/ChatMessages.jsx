import Messages from "./Messages";

const ChatMessages = () => {
  const MessageList = [
    {
      id: 1,
      sender: "user",
      text: "Hello, Can you define Matter",
      time: "12:04",
    },
    {
      id: 2,
      sender: "robot",
      text: "Yes sure! Matter is anything that has mass and occupy space.",
      time: "12:04",
    },
    {
      id: 3,
      sender: "user",
      text: "waaw! what about photosynthsis.",
      time: "12:05",
    },
    {
      id: 4,
      sender: "robot",
      text: "It's the process by which green plants make their own food",
      time: "12:05",
    },
    {
      id: 5,
      sender: "user",
      text: "Thank you.",
      time: "12:06",
    },
    {
      id: 6,
      sender: "robot",
      text: "You are welcome!",
      time: "12:06",
    },
  ];
  return (
    <div className="grow overflow-scroll px-8">
      {MessageList &&
        MessageList.map((item) => {
          return <Messages sender={item.sender} text={item.text} time={item.time} />;
        })}
    </div>
  );
};

export default ChatMessages;
