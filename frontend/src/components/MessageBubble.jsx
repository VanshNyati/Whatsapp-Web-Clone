// src/components/MessageBubble.jsx
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const BUSINESS_NUMBER = import.meta.env.VITE_BUSINESS_NUMBER || "918329446654";

function StatusTicks({ status }) {
  if (!status) return null;
  if (status === "sent") return <span>✓</span>;
  if (status === "delivered") return <span>✓✓</span>;
  if (status === "read") return <span style={{ color: "#34B7F1" }}>✓✓</span>;
  return <span>✓</span>;
}

export default function MessageBubble({ message }) {
  const from = message.from || "";
  const isOutgoing = from === "system" || from === BUSINESS_NUMBER;

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isOutgoing ? "bg-green-500 text-white" : "bg-white text-black"
        } shadow`}
      >
        {message.media && message.media.type === "audio" ? (
          <div className="flex items-center gap-2">
            <audio controls src={message.media.url} />
            <div className="text-xs text-gray-200">
              {message.media.duration ? `${message.media.duration}s` : ""}
            </div>
          </div>
        ) : (
          <div className="text-sm whitespace-pre-wrap">{message.text}</div>
        )}

        <div className="text-right text-xs mt-1 flex items-center justify-end gap-2">
          <span className="text-gray-200">
            {dayjs(message.timestamp).format("hh:mm A")}
          </span>
          {isOutgoing && <StatusTicks status={message.status} />}
        </div>
      </div>
    </div>
  );
}
