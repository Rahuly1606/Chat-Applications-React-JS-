import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { ArrowLeft } from "lucide-react";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check for mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile: show either sidebar or chat, not both
  // On desktop: show both

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 sm:pt-20 px-2 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-5rem)] sm:h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* For mobile: either show sidebar or chat */}
            {isMobile ? (
              selectedUser ? (
                <div className="flex flex-col w-full h-full">
                  {/* Back button for mobile */}
                  <div className="p-2 border-b flex items-center">
                    <button 
                      className="btn btn-sm btn-circle" 
                      onClick={() => setSelectedUser(null)}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <span className="ml-3 font-medium">{selectedUser.fullName}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatContainer />
                  </div>
                </div>
              ) : (
                <Sidebar />
              )
            ) : (
              // For desktop: show both sidebar and chat
              <>
                <div className="w-1/3 h-full border-r border-base-300">
                  <Sidebar />
                </div>
                <div className="w-2/3 h-full">
                  {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
