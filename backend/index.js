// backend/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoute from "./route/userRoute.js";
import bookRoute from "./route/bookRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Optional: Log critical environment variables at startup for debugging
console.log("→ MONGODB_URI:", process.env.MONGODB_URI);
console.log("→ API_KEY (SendGrid):", process.env.API_KEY ? `${process.env.API_KEY.slice(0, 8)}…` : undefined);
console.log("→ EMAIL_USER:", process.env.EMAIL_USER);
console.log("→ JWT_SECRET (first/last char):", 
  process.env.JWT_SECRET ? `${process.env.JWT_SECRET[0]}…${process.env.JWT_SECRET.slice(-1)}` : undefined
);

// 1. Global Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 2. Route Mounting
app.use("/user", userRoute);
app.use("/books", bookRoute);

// 3. Healthcheck (optional)
app.get("/", (req, res) => {
  res.send("Library Management System API is running.");
});

// 4. Global Error Handler
app.use((err, req, res, next) => {
  console.error("→ [GLOBAL ERROR]", err);

  // Duplicate‐key error on email field
  if (err.code === 11000 && err.keyPattern?.email) {
    return res.status(400).json({
      success: false,
      message: "User already exists.",
      status: 400,
    });
  }

  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    message,
    status,
    // In production, you might want to remove stack before sending to client
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// 5. Connect to MongoDB & Start Server
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
