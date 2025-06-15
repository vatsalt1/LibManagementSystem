import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/mail.js";

// 1) Register & send OTP
export const registerRoute = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "User exists" });
    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(email, otp);
    const user = await new User({ username, email, password: hashed, otp, isVerified: false }).save();
    res.status(201).json({ message: "OTP sent", userId: user._id });
  } catch (err) { next(err); }
};

// 2) Verify OTP
export const verifyOtpRoute = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next({ status: 400, message: "Email & OTP required" });
    const user = await User.findOne({ email });
    if (!user) return next({ status: 404, message: "User not found" });
    if (user.isVerified) return res.json({ message: "Already verified" });
    if (user.otp !== otp) return next({ status: 400, message: "Invalid OTP" });
    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.json({ message: "Email verified" });
  } catch (err) { next(err); }
};

// 3) Login
export const loginRoute = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ status: 404, message: "User not found" });
    if (!user.isVerified) return next({ status: 401, message: "Verify email first" });
    if (!await bcrypt.compare(password, user.password)) return next({ status: 401, message: "Wrong credentials" });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        favourites: user.favourites,
        membership: user.membership,
        bookInHand: user.bookInHand,
        rentedHistory: user.rentedHistory,
        requestedBooks: user.requestedBooks,
      },
    });
  } catch (err) { next(err); }
};

// 4) Profile & Admin
export const getUser = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    res.json({
      favourites: u.favourites,
      membership: u.membership,
      bookInHand: u.bookInHand,
      rentedHistory: u.rentedHistory,
      requestedBooks: u.requestedBooks,
    });
  } catch (err) { next(err); }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false }, { password: 0 });
    res.json(users);
  } catch (err) { next(err); }
};

export const updateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body._id, req.body);
    res.json({ message: "User updated" });
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) { next(err); }
};

// 5) Favourites
export const addFavourites = async (req, res, next) => {
  try {
    const exists = await User.findOne({ _id: req.body.userId, favourites: req.body.bookId });
    if (exists) return res.status(403).json({ message: "Already favourite" });
    await User.findByIdAndUpdate(req.body.userId, { $push: { favourites: req.body.bookId } });
    res.json({ message: "Added to favourites" });
  } catch (err) { next(err); }
};

export const getFavourites = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("favourites");
    res.json(u.favourites || []);
  } catch (err) { next(err); }
};

export const deleteFavourites = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $pull: { favourites: req.body.bookId } });
    res.json({ message: "Removed from favourites" });
  } catch (err) { next(err); }
};

// 6) Book in Hand (not returned)
export const getBookInHand = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).populate({
      path: "bookInHand",
      match: { returned: false },
      populate: {
        path: "bookId",
        model: "Book", // this must match the model name from bookModel.js
        select: "bookname authorname type", 
      },
    });

    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u.bookInHand || []);
  } catch (err) {
    next(err);
  }
};

// 7) Requested Books
export const getRequestedBooks = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("requestedBooks");
    res.json(u.requestedBooks || []);
  } catch (err) { next(err); }
};

// 8) Rented History (all rentals)
export const getRentedHistory = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).populate({
      path: "rentedHistory",
      select: "bookname authorname from_date to_date returned",
    });
    res.json(u.rentedHistory || []);
  } catch (err) { next(err); }
};
