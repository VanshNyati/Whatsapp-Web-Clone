// backend/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true }, // WhatsApp ID (phone number)
    name: { type: String, required: true },
    from: { type: String, required: true },
    id: { type: String, required: true, unique: true }, // WhatsApp message ID
    text: { type: String },
    type: { type: String },
    timestamp: { type: Date },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
