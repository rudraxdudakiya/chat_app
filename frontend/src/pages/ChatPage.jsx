import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { logout } = useAuthStore();

  return (
    <div className="z-20"><button onClick={logout}>Logout</button>ChatPage</div>
  )
}

export default ChatPage