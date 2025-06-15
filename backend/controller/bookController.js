// backend/controller/bookController.js
import Books   from "../model/bookModel.js";
import Request from "../model/requestModel.js";
import Rented  from "../model/rentedModel.js";
import User    from "../model/userModel.js";

export const booksRoute = async (req, res, next) => {
  try {
    res.json(await Books.find());
  } catch (err) { next(err); }
};

export const bookRoute = async (req, res, next) => {
  try {
    const b = await Books.findById(req.params.id);
    if (!b) return res.status(404).json({ message: "Book not found" });
    res.json(b);
  } catch (err) { next(err); }
};

export const categoryRoute = async (req, res, next) => {
  try {
    res.json(await Books.find({ type: req.params.type }));
  } catch (err) { next(err); }
};

export const createBook = async (req, res, next) => {
  try {
    await new Books(req.body).save();
    res.status(201).json({ message: "Book created" });
  } catch (err) { next(err); }
};

export const requestRoute = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;
    const user = await User.findById(userId);
    if (user.requestedBooks.some(r => r.bookId.toString() === bookId)) {
      return res.status(400).json({ message: "Already requested" });
    }
    const saved = await new Request(req.body).save();
    await User.findByIdAndUpdate(userId, {
      $push: { requestedBooks: { _id: saved._id, ...req.body } }
    });
    res.json({ message: "Request sent" });
  } catch (err) { next(err); }
};

export const requestedBooksRoute = async (req, res, next) => {
  try {
    res.json(await Request.find());
  } catch (err) { next(err); }
};

export const decisionRoute = async (req, res, next) => {
  try {
    const { userId, requestId, approve } = req.body;
    const reqDoc = await Request.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });
    if (approve) {
      const rented = new Rented({ ...reqDoc.toObject(), returned: false });
      const saveR = await rented.save();
      await User.findByIdAndUpdate(userId, {
        $pull: { requestedBooks: { _id: requestId } },
        $push: {
          bookInHand:    saveR._id,
          rentedHistory: saveR._id
        }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { requestedBooks: { _id: requestId } }
      });
    }
    await Request.findByIdAndDelete(requestId);
    res.json({ message: approve ? "Accepted" : "Declined" });
  } catch (err) { next(err); }
};

export const getAllRentalsRoute = async (req, res, next) => {
  try {
    res.json(await Rented.find());
  } catch (err) { next(err); }
};

export const returnedStatChange = async (req, res, next) => {
  try {
    const { userId, rentedId } = req.body;
    await User.findByIdAndUpdate(userId, {
      $pull: { bookInHand: { _id: rentedId } }
    });
    await Rented.findByIdAndUpdate(rentedId, { returned: true });
    res.json({ message: "Returned" });
  } catch (err) { next(err); }
};

export const updateBook = async (req, res, next) => {
  try {
    const upd = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!upd) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Updated", updatedBook: upd });
  } catch (err) { next(err); }
};

export const deleteBook = async (req, res, next) => {
  try {
    const del = await Books.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
