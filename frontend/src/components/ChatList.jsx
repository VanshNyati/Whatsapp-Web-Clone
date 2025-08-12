// src/components/ChatList.jsx
import { useContext, useMemo, useState, useCallback } from "react";
import { ChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import ChatSearchBar from "./ChatSearchBar";
import SidebarProfile from "./SidebarProfile";

export default function ChatList() {
  const { chats, setSelectedChat, selectedChat } = useContext(ChatContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSearch = useCallback((q) => setQuery(q.toLowerCase()), []);

  const filtered = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    if (!query) return chats;
    return chats.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const last = (c.lastMessage || "").toLowerCase();
      return name.includes(query) || last.includes(query);
    });
  }, [chats, query]);

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 font-bold text-lg border-b bg-green-600 text-white">
        WhatsApp Clone
      </div>

      <ChatSearchBar onSearch={onSearch} />

      <div className="flex-1 overflow-auto">
        {(!Array.isArray(filtered) || filtered.length === 0) && (
          <div className="p-4 text-gray-500">No chats found</div>
        )}
        {Array.isArray(filtered) &&
          filtered.map((chat) => {
            const active = selectedChat === chat._id;
            return (
              <div
                key={chat._id}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 flex items-center justify-between gap-3 ${
                  active ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat._id);
                  navigate(`/chat/${chat._id}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/48?u=${chat._id}`}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{chat.name}</div>
                    <div className="text-sm text-gray-600 truncate w-40">
                      {chat.lastMessage}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {chat.lastTimestamp
                      ? new Date(chat.lastTimestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                  {chat.unread > 0 && (
                    <div className="mt-1 inline-flex items-center justify-center bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="border-t">
        <SidebarProfile />
      </div>
    </div>
  );
}
