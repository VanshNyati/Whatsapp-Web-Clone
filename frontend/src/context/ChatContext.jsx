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

    const onNew = (data) => {
      fetchChats();
      if (data?.wa_id === selectedChat) fetchMessages(data.wa_id);
    };
    const onStatus = (data) => {
      fetchChats();
      setMessages((prev) =>
        Array.isArray(prev)
          ? prev.map((m) =>
              m.id === data.id ? { ...m, status: data.status } : m
            )
          : prev
      );
    };

    socket.on("new_message", onNew);
    socket.on("status_update", onStatus);

    return () => {
      socket.off("new_message", onNew);
      socket.off("status_update", onStatus);
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chats");
      setChats(Array.isArray(res.data) ? res.data : []);
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

      // mark unread = 0 if currently viewing this chat
      setChats((prev) => {
        const idx = prev.findIndex((c) => c._id === wa_id);
        if (idx === -1) return prev;
        const unread =
          wa_id === selectedChat
            ? 0
            : list.filter((m) => m.status !== "read" && m.from !== "system")
                .length;
        const updated = { ...prev[idx], unread };
        const next = [...prev];
        next[idx] = updated;
        return next;
      });
    } catch (error) {
      console.error("Failed to load messages", error);
      setMessages([]);
    }
  };

  // OPTIMISTIC send
  const sendMessage = async (wa_id, name, text) => {
    if (!wa_id || !text?.trim()) return;
    const now = new Date().toISOString();
    const optimistic = {
      _id: `local-${Date.now()}`,
      id: `local-${Date.now()}`,
      wa_id,
      name: name || "Unknown",
      from: "system",
      text: text.trim(),
      type: "text",
      timestamp: now,
      status: "sent",
      createdAt: now,
    };

    // update UI immediately
    setMessages((prev) =>
      Array.isArray(prev) ? [...prev, optimistic] : [optimistic]
    );
    setChats((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) {
        return [
          {
            _id: wa_id,
            name: name || "Unknown",
            lastMessage: optimistic.text,
            lastTimestamp: now,
            lastStatus: "sent",
            unread: 0,
          },
        ];
      }
      const idx = prev.findIndex((c) => c._id === wa_id);
      const updated = {
        _id: wa_id,
        name: idx >= 0 ? prev[idx].name : name || "Unknown",
        lastMessage: optimistic.text,
        lastTimestamp: now,
        lastStatus: "sent",
        unread: 0,
      };
      const next = [...prev];
      if (idx >= 0) next[idx] = updated;
      else next.unshift(updated);
      return next;
    });

    // persist + notify others
    try {
      await api.post("/send", { wa_id, name, text: optimistic.text });
    } catch (error) {
      console.error("Failed to send message", error);
      // optional: mark as failed
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
