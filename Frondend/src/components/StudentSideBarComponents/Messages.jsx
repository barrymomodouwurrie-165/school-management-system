import userPic from "../../assets/user.webp";
import robotPic from "../../assets/chatbot.jpg";

const Messages = ({ sender, text, time }) => {
  return (
    <div
      className={`${sender === "user" ? "flex items-center" : "flex items-center justify-end gap-2"} my-4`}
    >
      {sender === "user" && (
        <img src={userPic} alt="" className="w-[45px] h-[30px] rounded-full" />
      )}
      <div
        className={`max-w-[min(90%,40rem)] rounded-md px-3 py-2 text-sm text-white ${
          sender === "user" ? "bg-green-700" : "bg-blue-700"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{text}</div>
        <div className="mt-1 text-end text-xs opacity-75">{time}</div>
      </div>
      {sender === "robot" && (
        <img src={robotPic} alt="" className="w-[30px] h-[30px] rounded-full" />
      )}
    </div>
  );
};

export default Messages;
