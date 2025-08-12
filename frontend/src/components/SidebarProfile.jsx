import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { FiMoreVertical } from "react-icons/fi";

export default function SidebarProfile() {
  const {} = useContext(ChatContext);

  return (
    <div className="p-3 border-t bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=200"
          alt="me"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-medium">You</div>
          <div className="text-xs text-gray-500">Available</div>
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100">
        <FiMoreVertical />
      </button>
    </div>
  );
}
