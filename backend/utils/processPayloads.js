// backend/utils/processPayloads.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { processPayloadData } = require("../services/messageService");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

async function run() {
  const folder = path.join(__dirname, "../payloads");
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(folder, file), "utf-8"));
    await processPayloadData(data);
    console.log(`Processed ${file}`);
  }

  mongoose.connection.close();
}

run();
