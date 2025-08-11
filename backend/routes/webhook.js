// backend/routes/webhook.js
const express = require("express");
const router = express.Router();
const { processPayloadData } = require("../services/messageService");

module.exports = (io) => {
  router.post("/", async (req, res) => {
    try {
      const result = await processPayloadData(req.body);

      if (result) {
        // Emit real-time event to frontend
        if (result.type === "message") {
          io.emit("new_message", result);
        } else if (result.type === "status") {
          io.emit("status_update", result);
        }
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
