import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import { useAuthStore } from "../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessageLoadingState";

function ChatContainer() {
  const { allMessages, fetchAllMessagesByUserId, isMessagesLoading } = useChatStore();
  const { selectedChatPartner } = useChatStore();
  const { authUser } = useAuthStore();

  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimer = useRef(null);

  useEffect(() => {
    // Clear any existing timer
    if (skeletonTimer.current) {
      clearTimeout(skeletonTimer.current);
      skeletonTimer.current = null;
    }

    if (isMessagesLoading) {
      // Start 1 second timer to show skeleton
      skeletonTimer.current = setTimeout(() => {
        setShowSkeleton(true);
      }, 1000);
    }
    
    return () => {
      if (skeletonTimer.current) {
        clearTimeout(skeletonTimer.current);
        skeletonTimer.current = null;
      }
    };
  }, [isMessagesLoading]);

  // Separate effect to hide skeleton when loading ends
  useEffect(() => {
    if (!isMessagesLoading) {
      // Use timeout to avoid synchronous state update warning
      setTimeout(() => setShowSkeleton(false), 0);
    }
  }, [isMessagesLoading]);

  useEffect(() => {
    if (selectedChatPartner) {
      fetchAllMessagesByUserId(selectedChatPartner._id);
    }
  }, [fetchAllMessagesByUserId, selectedChatPartner]);

  const noMessages = allMessages.length === 0;

  return (
    <div>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {allMessages.length > 0 && !isMessagesLoading ? (
          // 📩 Messages
          <div className="max-w-3xl mx-auto space-y-6">
            {allMessages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser?._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser?._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} className="rounded-lg h-48 object-cover" alt="Shared" />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : showSkeleton && isMessagesLoading ? (
          <MessagesLoadingSkeleton />

        ) : !isMessagesLoading && noMessages ? (
          <NoChatHistoryPlaceholder name={selectedChatPartner.fullname} />

        ) : null}
      </div>
    </div>
  );
}

export default ChatContainer;
