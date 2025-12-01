import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UserSkelaton";

function ContactsList() {
  const { fetchAllContacts, allContacts, setSelectedChatPartner, isUsersLoading } = useChatStore();

  useEffect(() => { 
    fetchAllContacts();
  }, [fetchAllContacts])

  if(isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-3 p-4">
      {allContacts.map((contact) => (
        <div 
          key={contact._id}
          className="bg-cyan-500/10 p-4 hover:bg-cyan-500/20 cursor-pointer transition-colors rounded-lg"
          onClick={() => setSelectedChatPartner(contact)}
        > 
          <div className="flex items-center gap-3">
            <div className="avatar avatar-online">
              <div className="size-12 rounded-full overflow-hidden">
                <img 
                  src={contact.profilePicture || "/avatar.png"}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.fullname}</h4>
          </div>
        </div>
      ))}
    </div>  
)
}

export default ContactsList