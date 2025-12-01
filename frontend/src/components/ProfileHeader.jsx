import { useRef, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { Loader2, LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react"

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
    const { authUser, logout, updateProfile, isUpdatingProfile } = useAuthStore();
    const { isSoundOn, toggleSound } = useChatStore();
    const [imgSelected, setImgSelected] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgSelected(reader.result);
          updateProfile({ profilePic: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }

    return <div className="p-6 border-b border-slate-700/50 ">
      <div className="items-center justify-between flex">
        <div className="flex items-center gap-4">
          <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              {isUpdatingProfile ? 
                (
                  <center>
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </center>
                ) : (
                <img
                  src={imgSelected || authUser?.user?.profilePicture || "/avatar.png"}
                  alt="User image"
                  className="size-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
          </div>
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.user.fullname}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>       
          <div className="flex gap-4 items-center">
            <button
              className="text-slate-400 hover:text-red-500 transition-colors"
              onClick={logout}
            >
              <LogOutIcon className="size-5" />
            </button>
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => {
                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
                toggleSound();
              }}
            >
              {isSoundOn ? (
                <Volume2Icon className="size-6" color="green"/>
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>
          </div>   
        </div>
      </div>
    </div>
}

export default ProfileHeader