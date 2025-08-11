// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:wa_id", async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
