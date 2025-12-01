import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

function ChatHeader() {
  const { selectedChatPartner, setSelectedChatPartner } = useChatStore();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedChatPartner(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedChatPartner]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1 p-3"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar avatar-online}`}>
          <div className="w-12 rounded-full">
            <img src={selectedChatPartner.profilePicture || "/avatar.png"} alt={selectedChatPartner.fullName} />
          </div>
        </div>

        <div>
            <h3 className="text-slate-200 font-medium">{selectedChatPartner.fullname}</h3>
            <p className="text-slate-400 text-sm">Online</p>
        </div>
      </div>

     
      <button 
        onClick={() => setSelectedChatPartner(null)}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white hover:bg-red-600 shadow-inner ring-1 ring-red-700/40 transition focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        <span className="text-gray-800 hover:text-black text-xs leading-none font-bold">×</span>
      </button>
    </div>
  );
}
export default ChatHeader;