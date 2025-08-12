// src/components/ChatHeader.jsx
import { FiVideo, FiPhone, FiSearch, FiMoreVertical } from "react-icons/fi";

export default function ChatHeader({ name, wa_id, lastSeen, onBack }) {
  return (
    <div className="p-3 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1" onClick={onBack} title="Back">
          {/* simple back caret */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0L4.586 11l3.707-3.707a1 1 0 111.414 1.414L7.414 11l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <img
          src={`https://i.pravatar.cc/40?u=${wa_id}`}
          alt={name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{lastSeen}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          title="Video call"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiVideo />
        </button>
        <button
          title="Voice call"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiPhone />
        </button>
        <button
          title="Search in chat"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiSearch />
        </button>
        <button title="More" className="p-2 hover:bg-gray-100 rounded-full">
          <FiMoreVertical />
        </button>
      </div>
    </div>
  );
}
