import { useAuthStore } from "../store/useAuthStore";
import { Loader, LockIcon, Mail } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimated"
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate("/");
    }
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[725px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row bg-[#1D293A]">
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl bg-[#1D293A]">
                <div>
                    <img
                      src="/img4.png"
                      alt="People using mobile devices"
                      className="w-full h-[320px] object-contain"
                    />
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>
                    <div className="mt-4 flex justify-center gap-4">
                      <span className="auth-badge">Free</span>
                      <span className="auth-badge">Easy Setup</span>
                      <span className="auth-badge">Private</span>
                    </div>
                  </div>
                </div>
              </div>
            <div className="md:w-1/2 p-8 flex items-center justify-center bg-[#1D293A] md:border-l border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <img src="/logo.svg" alt="Logo" className="w-16 h-46 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-300 to-green-600 bg-clip-text text-transparent mb-2">Welcome Back !</h2>
                  <p className="text-slate-400">Login to access your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <Mail className="auth-input-icon" />
                      <input
                        autoFocus
                        type="text"
                        className="input"
                        placeholder="jhondoe@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  {/* password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="hover:rounded-full border-2 border-transparent w-full hover:bg-[#9eb6ee] bg-blue-300  hover:border-3 hover:border-black text-black font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? <Loader className="animate-spin text-center w-full h-5" /> : "Login"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/signup" className="hover:rounded-full auth-link">
                      Don't have an account? Sign up
                    </Link>
                </div>  
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default LoginPage