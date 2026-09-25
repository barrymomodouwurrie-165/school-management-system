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
        className={`${sender === "user" ? "bg-green-600 rounded-md px-2 py-1 text-sm italic max-w-[500px]" : "bg-blue-600 rounded-md px-2 py-1 text-sm italic max-w-[500px]"}`}
      >
        <div className="mr-6">{text}</div>
        <div className="text-end">{time}</div>
      </div>
      {sender === "robot" && (
        <img src={robotPic} alt="" className="w-[30px] h-[30px] rounded-full" />
      )}
    </div>
  );
};

export default Messages;
