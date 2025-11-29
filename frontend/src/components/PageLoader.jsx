import {Loader2} from "lucide-react";
function PageLoader() {
  return (
    <div>
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-16 h-16 text-gray-500 animate-spin" />
        </div>
    </div>
  )
}

export default PageLoader