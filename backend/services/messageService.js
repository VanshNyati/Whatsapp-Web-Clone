// backend/services/messageService.js
const Message = require("../models/Message");

async function processPayloadData(data) {
  const entry = data.metaData.entry[0];
  const changes = entry.changes[0].value;

  if (changes.messages) {
    // New message
    const contact = changes.contacts?.[0];
    const msg = changes.messages[0];

    await Message.updateOne(
      { id: msg.id },
      {
        wa_id: contact.wa_id,
        name: contact.profile.name,
        from: msg.from,
        id: msg.id,
        text: msg.text?.body || "",
        type: msg.type,
        timestamp: new Date(Number(msg.timestamp) * 1000),
      },
      { upsert: true }
    );

    return { type: "message", wa_id: contact.wa_id, id: msg.id };
  }

  if (changes.statuses) {
    // Status update
    const statusData = changes.statuses[0];

    await Message.updateOne(
      { id: statusData.id },
      { status: statusData.status }
    );

    return { type: "status", id: statusData.id, status: statusData.status };
  }

  return null;
}

module.exports = { processPayloadData };
