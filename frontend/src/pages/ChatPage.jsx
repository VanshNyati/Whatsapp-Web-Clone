import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";

export default function ChatPage() {
  const { wa_id } = useParams();
  const { messages, fetchMessages, sendMessage, chats } =
    useContext(ChatContext);

  useEffect(() => {
    fetchMessages(wa_id);
  }, [wa_id]);

  const chat = chats.find((c) => c._id === wa_id);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4 bg-white">
        <h2 className="font-bold">Chats</h2>
        {/* Could link back to home */}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{chat?.name}</h2>
          <p className="text-sm text-gray-500">{chat?._id}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 max-w-xs p-2 rounded ${
                  msg.from === wa_id
                    ? "bg-white self-start"
                    : "bg-green-100 self-end ml-auto"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-xs text-gray-500">
                  {msg.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages</p>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = e.target.text.value.trim();
            if (text) {
              sendMessage(wa_id, chat?.name, text);
              e.target.reset();
            }
          }}
          className="flex border-t"
        >
          <input
            name="text"
            className="flex-1 p-2 outline-none"
            placeholder="Type a message"
          />
          <button className="bg-green-500 text-white px-4">Send</button>
        </form>
      </div>
    </div>
  );
}
