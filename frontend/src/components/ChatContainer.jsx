import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessageLoadingState";

function ChatContainer() {
  const { allMessages, fetchAllMessagesByUserId, isMessagesLoading } = useChatStore();
  const { selectedChatPartner } = useChatStore();
  const { authUser } = useAuthStore();

    useEffect(() => {
    if (selectedChatPartner) {
      fetchAllMessagesByUserId(selectedChatPartner._id);
    }
  }, [fetchAllMessagesByUserId, selectedChatPartner]);
  
  const messageEndRef = useRef(null);
   useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {allMessages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {allMessages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser.user._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser.user._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs opacity-75 mt-2 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedChatPartner.fullname} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;