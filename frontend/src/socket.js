// frontend/src/socket.js
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(backendUrl, {
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});

export default socket;
