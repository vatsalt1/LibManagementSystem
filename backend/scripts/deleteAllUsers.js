// backend/scripts/deleteAllUsers.js
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import User from "../model/userModel.js";

// Figure out where this script lives (…/backend/scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Build the path to backend/.env
const envPath = resolve(__dirname, "../.env");
console.log("→ Looking for .env at:", envPath);
console.log("→ .env exists?", fs.existsSync(envPath));

// Read raw contents of .env
const raw = fs.readFileSync(envPath, "utf-8");
// Show invisible characters by JSON-stringifying the raw string
console.log("→ Raw .env content (JSON‐escaped):", JSON.stringify(raw));

// Now let dotenv try to parse it
dotenv.config({ path: envPath });
console.log("→ After dotenv.config(), MONGODB_URI:", process.env.MONGODB_URI);

async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const countBefore = await User.countDocuments();
    console.log(`Users before delete: ${countBefore}`);

    const result = await User.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} users`);

    const countAfter = await User.countDocuments();
    console.log(`Users after delete: ${countAfter}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error deleting users:", err);
    process.exit(1);
  }
}

deleteAllUsers();
