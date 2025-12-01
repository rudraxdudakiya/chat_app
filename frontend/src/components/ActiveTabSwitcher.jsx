import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div role="tablist" className="mt-4 p-2 grid grid-cols-2 gap-2 w-full">
        <button
          role="tab"
          onClick={() => setActiveTab("chats")}
          aria-selected={activeTab === "chats"}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none  ${
            activeTab === "chats"
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          Chats
        </button>

        <button
          role="tab"
          onClick={() => setActiveTab("contacts")}
          aria-selected={activeTab === "contacts"}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none  ${
            activeTab === "contacts"
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          Contacts
        </button>
      </div>
  );
}

export default ActiveTabSwitch;