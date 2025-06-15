import express from "express";
import {
  registerRoute,
  verifyOtpRoute,
  loginRoute,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  addFavourites,
  getFavourites,
  deleteFavourites,
  getBookInHand,
  getRequestedBooks,
  getRentedHistory,
} from "../controller/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",       registerRoute);
router.post("/verify-otp",     verifyOtpRoute);
router.post("/login",          loginRoute);

router.get("/:id",             verifyToken, getUser);
router.get("/",                verifyToken, verifyAdmin, getUsers);
router.put("/edit",            verifyToken, updateUser);
router.delete("/delete/:id",   verifyToken, verifyAdmin, deleteUser);

router.put("/addFav",          verifyToken, addFavourites);
router.get("/getfav/:id",      verifyToken, getFavourites);
router.put("/deletefav",       verifyToken, deleteFavourites);

router.get("/get/bookinhand/:id", verifyToken, getBookInHand);
router.get("/get/requested/:id",  verifyToken, getRequestedBooks);
router.get("/get/rented/:id",     verifyToken, getRentedHistory);

export default router;
