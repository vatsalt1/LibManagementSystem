import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:        { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  isVerified:      { type: Boolean, default: false },
  otp:             { type: String },
  isAdmin:         { type: Boolean, default: false },
  favourites:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  membership:      { type: String, default: "free" },
  bookInHand:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Rented" }],
  rentedHistory:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Rented" }],
  requestedBooks:  [{
    bookId:     { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    bookname:   String,
    authorname: String,
    genre:      String,
    from_date:  String,
    to_date:    String,
    amount:     Number,
  }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
