import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

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
            console.error("Auth check failed: ", err);
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
            toast.success("Login successful");
            set({ authUser: res.data });
            get().connectSocket();
            window.location.href = "/";
        } catch (err) {
            console.error("Login failed: ", err);
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
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
        const {authUser, socket} = get();
        if (!authUser || socket?.connected) return;

        const socketio = io(BASE_URL, {
            withCredentials: true,
        });

        set({ socket: socketio });

        socketio.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
    }
}));