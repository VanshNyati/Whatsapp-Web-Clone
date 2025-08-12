// src/components/MessageInput.jsx
import { useState, useContext, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { FiPaperclip, FiMic } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import dynamic from "react"; // we'll use lazy
import { BiStopwatch } from "react-icons/bi";

const EmojiPicker = ({ onSelect }) => {
  // lazy import to avoid build-time issues
  const [Picker, setPicker] = useState(null);
  useEffect(() => {
    let mounted = true;
    import("emoji-picker-react").then((mod) => {
      if (mounted) setPicker(() => mod.default || mod);
    });
    return () => (mounted = false);
  }, []);

  if (!Picker) return null;
  // current emoji-picker-react v4 callback signature: onEmojiClick={(emojiData) => ...}
  return <Picker onEmojiClick={(emoji) => onSelect(emoji.emoji)} />;
};

export default function MessageInput({ wa_id }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const recordTimerRef = useRef(null);

  const { chats, sendMessage } = useContext(ChatContext);
  const chat = Array.isArray(chats) ? chats.find((c) => c._id === wa_id) : null;
  const name = chat?.name || "Unknown";

  const onEmojiSelect = (emoji) => {
    setText((t) => t + emoji);
    setShowEmoji(false);
  };

  const handleSend = async () => {
    if (text.trim()) {
      await sendMessage(wa_id, name, text.trim(), null);
      setText("");
    }
  };

  // AUDIO: start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      setMediaRecorder(mr);
      setChunks([]);
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };
      mr.onstop = async () => {
        // assemble blob
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = recordTime;
        // send optimistic message with media
        await sendMessage(wa_id, name, "", { type: "audio", url, duration });
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
        setRecordTime(0);
      };
      mr.start();
      setIsRecording(true);
      recordTimerRef.current = setInterval(() => {
        setRecordTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic permission denied", err);
      alert("Microphone access is needed to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
    setMediaRecorder(null);
    setChunks([]); // handled in onstop
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
    setMediaRecorder(null);
    setChunks([]);
    setRecordTime(0);
  };

  return (
    <div className="p-3 flex items-center gap-2 bg-white">
      <button
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={() => setShowEmoji((s) => !s)}
      >
        <BsEmojiSmile />
      </button>

      <div className="relative flex-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="w-full border rounded-full px-4 py-2 outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {showEmoji && (
          <div className="absolute bottom-12 left-0 z-30 bg-white shadow rounded">
            <EmojiPicker onSelect={onEmojiSelect} />
          </div>
        )}

        {isRecording && (
          <div className="absolute -bottom-12 left-0 bg-white p-2 rounded shadow flex items-center gap-2">
            <div className="text-sm text-red-600">● Recording</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <BiStopwatch /> {recordTime}s
            </div>
            <button
              onClick={stopRecording}
              className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
            >
              Send
            </button>
            <button
              onClick={cancelRecording}
              className="ml-2 px-2 py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button className="p-2 rounded-full hover:bg-gray-100">
        <FiPaperclip />
      </button>

      {/* Send or start/stop recording */}
      <button
        className="p-2 rounded-full bg-green-600 text-white flex items-center gap-2"
        onClick={() => {
          if (text.trim()) {
            handleSend();
          } else {
            // toggle recording
            if (!isRecording) startRecording();
            else stopRecording();
          }
        }}
      >
        {text.trim() ? "Send" : isRecording ? "Stop" : <FiMic />}
      </button>
    </div>
  );
}
