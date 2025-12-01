import {useChatStore} from "../store/useChatStore"
import BorderAnimatedContainer from "../components/BorderAnimated"
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitcher from "../components/ActiveTabSwitcher"
import ChatsList from "../components/ChatsList"
import ContactsList from "../components/ContactsList"
import ChatContainer from "../components/ChatContainer"
import ChatContainerPlaceHolder from "../components/ChatContainerPlaceHolder"

function ChatPage() {
    const {activeTab,selectedChatPartner} = useChatStore();
    return (
        <div className="relative w-full max-w-6xl h-[800px]">
            <BorderAnimatedContainer>
                {/* LEFT SIDE */}
                <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
                  <ProfileHeader />
                  <ActiveTabSwitcher />

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
                  {selectedChatPartner ? <ChatContainer /> : <ChatContainerPlaceHolder />}
                </div>                                      
            </BorderAnimatedContainer>
        </div>
    )
}

export default ChatPage