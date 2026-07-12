import Messages from "./Messages";

const ChatMessages = () => {
  const MessageList = [
    {
      id: 1,
      sender: "user",
      text: "Hello, Can you define Matter",
    },
    {
      id: 2,
      sender: "robot",
      text: "Yes sure! Matter is anything that has mass and occupy space.",
    },
    {
      id: 3,
      sender: "user",
      text: "Thank you.",
    },
    {
      id: 4,
      sender: "robot",
      text: "You are welcome!",
    },
    
  ];
  return (
    <div className="flex-grow-1 overflow-scroll px-8">
      {MessageList &&
        MessageList.map((item) => {
          return <Messages sender={item.sender} text={item.text} />;
        })}
    </div>
  );
};

export default ChatMessages;
