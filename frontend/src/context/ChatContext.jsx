/* eslint react-refresh/only-export-components: off */
import { createContext, useState, useEffect } from "react";
import api from "../api";
import socket from "../socket";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    fetchChats();

    socket.on("new_message", (data) => {
      fetchChats();
      if (data.wa_id === selectedChat) {
        fetchMessages(data.wa_id);
      }
    });

    socket.on("status_update", (data) => {
      fetchChats();
      setMessages((prev) =>
        Array.isArray(prev)
          ? prev.map((m) =>
              m.id === data.id ? { ...m, status: data.status } : m
            )
          : prev
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("status_update");
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chats");
      const list = Array.isArray(res.data) ? res.data : [];
      setChats(list);
    } catch (error) {
      console.error("Failed to load chats", error);
      setChats([]);
    }
  };

  const fetchMessages = async (wa_id) => {
    try {
      const res = await api.get(`/messages/${wa_id}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);

      // Update unread count only if not currently in chat
      setChats((prev) => {
        const idx = prev.findIndex((c) => c._id === wa_id);
        if (idx === -1) return prev;

        const unread =
          wa_id === selectedChat
            ? 0
            : list.filter((m) => m.status !== "read" && !(m.from === "system"))
                .length;

        const updatedChat = { ...prev[idx], unread };

        const newArr = [...prev];
        newArr[idx] = updatedChat;
        return newArr;
      });
    } catch (error) {
      console.error("Failed to load messages", error);
      setMessages([]);
    }
  };

  const sendMessage = async (wa_id, name, text) => {
    try {
      await api.post("/send", { wa_id, name, text });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        selectedChat,
        setSelectedChat,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
