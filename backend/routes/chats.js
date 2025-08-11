// backend/routes/chats.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/", async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" },
          lastStatus: { $first: "$status" },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
