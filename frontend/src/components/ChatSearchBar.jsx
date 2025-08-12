// src/components/ChatSearchBar.jsx
import { useState, useEffect } from "react";

export default function ChatSearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(q.trim()), 150);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  return (
    <div className="p-3 border-b bg-white">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search or start new chat"
          className="flex-1 bg-gray-100 rounded-full px-3 py-2 outline-none text-sm"
        />
      </div>
    </div>
  );
}
