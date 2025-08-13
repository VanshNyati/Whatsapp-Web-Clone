// backend/routes/send.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

module.exports = (io) => {
  router.post("/", async (req, res) => {
    try {
      const { wa_id, name, text } = req.body;
      if (!wa_id || !name || !text) {
        return res
          .status(400)
          .json({ error: "wa_id, name and text are required" });
      }

      const newMessage = new Message({
        wa_id,
        name,
        from: "system", // our app
        id: `local-${Date.now()}`, // unique local id
        text,
        type: "text",
        timestamp: new Date(),
        status: "sent",
      });

      await newMessage.save();

      // IMPORTANT: notify all clients in real-time
      io.emit("new_message", { type: "message", wa_id, id: newMessage.id });

      res.json(newMessage);
    } catch (err) {
      console.error("POST /api/send error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
