// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const chatsRoute = require("./routes/chats");
const messagesRoute = require("./routes/messages");
const sendRoute = require("./routes/send");
const webhookRoute = require("./routes/webhook");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.ALLOW_ORIGIN?.split(",") || "*" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/send", sendRoute(io));
app.use("/api/webhook", webhookRoute(io));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
