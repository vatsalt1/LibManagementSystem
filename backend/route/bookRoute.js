// backend/route/bookRoute.js
import express from "express";
const router = express.Router();

import {
  booksRoute,
  bookRoute,
  categoryRoute,
  createBook,
  requestRoute,
  requestedBooksRoute,
  getAllRentalsRoute,
  decisionRoute,
  returnedStatChange,
  updateBook,
  deleteBook,
} from "../controller/bookController.js";

router.get("/",             booksRoute);
router.get("/:id",          bookRoute);
router.get("/all/:type",    categoryRoute);
router.post("/create",      createBook);

router.post("/request",     requestRoute);
router.get("/request/all",  requestedBooksRoute);

router.post("/request/one", decisionRoute);

router.get("/rentals/all",      getAllRentalsRoute);
router.put("/returned/update",  returnedStatChange);

router.put("/:id",          updateBook);
router.delete("/:id",       deleteBook);

export default router;
