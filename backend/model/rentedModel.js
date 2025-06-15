import mongoose from "mongoose";

const rentedSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
  bookId:     { type: mongoose.Schema.Types.ObjectId, ref: "Book",   required: true },
  bookname:   { type: String,                           required: true },
  authorname: { type: String,                           required: true },
  genre:      { type: String,                           required: true },
  from_date:  { type: String,                           required: true },
  to_date:    { type: String,                           required: true },
  amount:     { type: Number,                           required: true },
  returned:   { type: Boolean,                          required: true },
}, { timestamps: true });

export default mongoose.model("Rented", rentedSchema);
