import { Navigate, Route, Routes } from "react-router"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
   const { authUser, isAuthChecking, checkAuth } = useAuthStore();

   useEffect(() => {
      checkAuth();
   }, [checkAuth, authUser]);

   if (isAuthChecking) return <PageLoader />;
   

   return (
      <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
         {/* DECORATORS - GRID BG & GLOW SHAPES */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
         <div className="absolute top-0 -left-4 size-96 bg-orange-600 opacity-20 blur-[100px]" />
         <div className="absolute bottom-0 -right-4 size-96 bg-green-600 opacity-20 blur-[100px]" />

         <Routes>
               <Route path="/" element={(authUser) ? <ChatPage /> : <Navigate to="/login" />} />
               <Route path="/login" element={(!authUser) ? <LoginPage /> : <Navigate to="/" />} />
               <Route path="/signup" element={(!authUser) ? <SignupPage /> : <Navigate to="/" />} />
         </Routes>

         <Toaster />
         {/* <a
                href="/"
                aria-label="App Home"
                className="fixed bottom-4 right-4 inline-flex items-center justify-center"
             >
                <img
                   src="/logo.svg"
                   alt="App logo"
                   className="w-10 h-10 rounded-lg shadow transition transform hover:scale-125"
                />
             </a> */}
      </div>
   )
}

export default App 