import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookname:   { type: String, required: true },
  authorname: { type: String, required: true },
  type:       { type: String, required: true },
  rating:     { type: Number },
  bookImage:  { type: String },
  price:      { type: Number, required: true },
});

export default mongoose.model("Book", bookSchema);
