// backend/routes/send.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;

    const newMessage = new Message({
      wa_id,
      name,
      from: "system", // Our system sending the message
      id: `local-${Date.now()}`, // Unique local ID
      text,
      type: "text",
      timestamp: new Date(),
      status: "sent",
    });

    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
