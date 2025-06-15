import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./model/userModel.js";

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({});
  console.log("Users in DB:", users);
  console.log(process.env.MONGODB_URI);
  await mongoose.disconnect();
}

test();
