import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";

export default function ChatWindow() {
  const { wa_id } = useParams();
  const navigate = useNavigate();
  const { messages, fetchMessages, chats } = useContext(ChatContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastMessageRef = useRef(null);

  // Fetch messages on chat change
  useEffect(() => {
    fetchMessages(wa_id);
  }, [wa_id]);

  // Keep local state synced
  useEffect(() => {
    if (Array.isArray(messages)) {
      setChatMessages(messages);
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [chatMessages]);

  const chat = chats.find((c) => c._id === wa_id);

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-3">
          {/* Back button (mobile only) */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            <FiArrowLeft size={20} />
          </button>
          <img
            src={`https://i.pravatar.cc/40?u=${chat?.wa_id || "default"}`}
            alt={chat?.name || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{chat?.name}</div>
            <div className="text-xs text-gray-500">{chat?.wa_id}</div>
          </div>
        </div>

        {/* Desktop: show actions inline; Mobile: menu button */}
        <div className="hidden md:flex gap-4 text-gray-600">
          <button className="hover:text-green-500">📞</button>
          <button className="hover:text-green-500">🎥</button>
          <button className="hover:text-green-500">🔍</button>
        </div>

        <div className="md:hidden relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Voice Call
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Video Call
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Search
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                View Contact
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatMessages.map((msg, index) => (
          <div
            key={msg._id || index}
            ref={index === chatMessages.length - 1 ? lastMessageRef : null}
          >
            <MessageBubble message={msg} />
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput wa_id={wa_id} />
    </div>
  );
}
