import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { chats } = useContext(ChatContext);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full max-w-sm border-r bg-white">
        <h1 className="p-4 font-bold text-lg border-b">Chats</h1>
        {(!Array.isArray(chats) || chats.length === 0) && (
          <p className="p-4 text-gray-500">No chats yet</p>
        )}
        {Array.isArray(chats) && chats.map((chat) => (
          <Link
            key={chat._id}
            to={`/chat/${chat._id}`}
            className="block p-4 hover:bg-gray-50 border-b"
          >
            <p className="font-medium">{chat.name}</p>
            <p className="text-sm text-gray-500">{chat.lastMessage}</p>
          </Link>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    </div>
  );
}
