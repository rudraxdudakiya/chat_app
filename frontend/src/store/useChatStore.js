import axiousInstance from '../lib/axios';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    allContacts: [],
    allChatPartners: [],
    allMessages: [],
    isUsersLoading: false,
    activeTab: 'chats',
    selectedChatPartner: null,
    isSoundOn: localStorage.getItem("isSoundOn") === "true",
    isMessagesLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),
    
    setSelectedChatPartner: (partner) => {set({ selectedChatPartner: partner }); console.log(partner);
    },

    toggleSound: () => { 
        localStorage.setItem("isSoundOn", (!get().isSoundOn).toString()); 
        set({ isSoundOn: !get().isSoundOn });
    },

    fetchAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiousInstance.get('/messages/contacts');
            set({ allContacts: res.data });
        } catch (err) {
            console.error('Failed to fetch contacts: ', err);
            toast.error('Failed to load contacts. Please try again.');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    fetchAllChatPartners: async () => {
        set({ isUsersLoading: true });  
        try {
            const res = await axiousInstance.get('/messages/chats');
            set({ allChatPartners: res.data });
        } catch (err) {
            console.error('Failed to fetch chat partners: ', err);
            toast.error('Failed to load chat partners. Please try again.');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    fetchAllMessages: async (userId) => {
        set({ isMessagesLoading: true });   
        try {
            const res = await axiousInstance.get(`/messages/${userId}`);
            set({ allMessages: res.data });
            toast.success('Messages loaded successfully');
        } catch (err) {
            console.error('Failed to fetch messages: ', err);
            toast.error('Failed to load messages. Please try again.');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    fetchAllMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiousInstance.get(`/messages/${userId}`);
            set({ allMessages: res.data });
        } catch (err) {
            console.error('Failed to fetch messages: ', err);
            toast.error('Failed to load messages. Please try again.');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedChatPartner, allMessages } = get();
        const {authUser} = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
        _id: tempId,
        senderId: authUser.user._id,
        receiverId: selectedChatPartner._id,
        text: messageData.text,
        image: messageData.imageUrl,
        createdAt: new Date().toISOString(),
        isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immidetaly update the ui by adding the message
        set({ allMessages: [...allMessages, optimisticMessage] });
        try {
            const res = await axiousInstance.post(`/messages/send/${selectedChatPartner._id}`, messageData);
      set({ allMessages: allMessages.concat(res.data) });
        } catch (err) {
            set((state) => ({ allMessages: state.allMessages.filter(msg => msg._id !== tempId) }));
            console.error('Failed to send message: ', err);
            toast.error('Failed to send message. Please try again.');
        }
    },

    subscribeToMessages: () => {
    const { selectedChatPartner } = get();
    if (!selectedChatPartner) return;        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromselectedChatPartner = newMessage.senderId === selectedChatPartner._id;
            if (!isMessageSentFromselectedChatPartner) return;

            const currentMessages = get().allMessages;
            set({ allMessages: [...currentMessages, newMessage] });

            const currentState = get();
            if (currentState.isSoundOn) {
                console.log("Playing notification sound, isSoundOn:", currentState.isSoundOn);
                
                try {
                    const notificationSound = new Audio("/sounds/notification.mp3");
                    notificationSound.currentTime = 0;
                    
                    notificationSound.play().catch((e) => {
                        console.warn("Audio play failed (browser may require user interaction):", e.message);
                    });
                } catch (error) {
                    console.error("Failed to create audio:", error);
                }
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}));
