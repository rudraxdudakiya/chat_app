import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UserSkelaton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const { fetchAllChatPartners, allChatPartners, setSelectedChatPartner, isUsersLoading } = useChatStore();

  useEffect(() => { 
    fetchAllChatPartners();
  }, [fetchAllChatPartners])

  if(isUsersLoading) return <UsersLoadingSkeleton />;
  if(allChatPartners.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-3 p-4">
      {allChatPartners.map((chat) => (
        <div 
          key={chat._id}
          className="bg-cyan-500/10 p-4 hover:bg-cyan-500/20 cursor-pointer transition-colors rounded-lg"
          onClick={() => setSelectedChatPartner(chat)}
        > 
          <div className="flex items-center gap-3">
            <div className="avatar avatar-online">
              <div className="size-12 rounded-full overflow-hidden">
                <img 
                  src={chat.profilePicture || "/avatar.png"}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullname}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatsList