import axiousInstance from '../lib/axios';
import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useChatStore = create((set,get) => ({
    allContacts: [],
    allChatPartners: [],
    allMessages: [],
    isUsersLoading: false,
    activeTab: 'chats',
    selectedChatPartner: null,
    isSoundOn: localStorage.getItem("isSoundOn") === true,
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
}));
