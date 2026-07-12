import { FaPaperPlane } from "react-icons/fa";
import ChatMessages from "./ChatMessages";
const AiAssistance = () => {
  const Suggestions = [
    { id: 1, message: "What is photosynthesis?" },
    { id: 2, message: "Explain the term adjective and give a few examples" },
    { id: 3, message: "Can you please write the multiples of 3 less than 30" },
  ];
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 border text-white rounded-lg [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <div className="py-4 px-2">
          <ChatMessages />
          <div className="max-w-4xl flex items-center gap-2 px-2">
            <input
              type="text"
              className="input input-bordered text-black w-full rounded-md my-4"
              placeholder="Ask me questions!"
            />
            <button className="btn btn-accent text-white w-12 h-12 flex items-center justify-center rounded-full p-2">
              <FaPaperPlane size={24} />
            </button>
          </div>
          <h2 className="italic mb-2">Quick suggestions!</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Suggestions &&
              Suggestions.map((suggestion) => {
                return (
                  <button
                    key={suggestion.id}
                    className=" btn btn-outline border-white text-white  rounded-md text-center text-sm"
                  >
                    {suggestion.message}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AiAssistance;
