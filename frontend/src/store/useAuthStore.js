import { create } from "zustand"
import axiosInstance, { baseURL as API_BASE_URL } from "../lib/axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthChecking: true,
    isLoggingIn: false,
    isSigningUp: false, 
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (err) {
            // 401 is expected if user is not logged in - don't show error
            if (err.response?.status !== 401) {
                console.error("Auth check failed: ", err);
            }
            // Still try to connect socket for real-time updates
            get().connectSocket();
        } finally {
            set({ isAuthChecking: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            toast.success("Signup successful, you can now log in!");
            return { success: true, data: res.data };
        } catch (err) {
            console.error("Signup failed: ", err);
            toast.error(err.response?.data?.message || "Signup failed. Please try again.");
            return { success: false, error: err };
        } finally {
            set({ isSigningUp: false});
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({ authUser: res.data });
            toast.success("Login successful");
            get().connectSocket();
            return { success: true, data: res.data };
        } catch (err) {
            console.error("Login failed: ", err);
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            return { success: false, error: err };
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
            set({ authUser: null });
            // get().disconnectSocket();
            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed: ", err);
            toast.error("Logout failed. Please try again.");
        }
    },
    updateProfile: async (updateData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/edit-profile", updateData);
            set((state) => ({ authUser: { ...state.authUser, ...res.data } }));
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Profile update failed: ", err);
            toast.error("Profile update failed. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const {socket} = get();
        if (socket?.connected) return;

        const socketio = io(API_BASE_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
        });

        set({ socket: socketio });

        socketio.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socketio.on("error", (error) => {
            console.error("Socket connection error:", error);
        });

        socketio.on("connect", () => {
            console.log("Socket connected successfully");
        });

        socketio.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
    }
}));