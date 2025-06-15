import React, { useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import {
  addBookInHand,
  addRequestedBooks,
  addRentedHistory,
} from "../action";
import useCurrentUser from "../hooks/useCurrentUser";
import { AiOutlineDown } from "react-icons/ai";
import blank from "../assets/blank-canva.svg";

const ExtrasInfoCard = ({ card, book, handle, visible }) => {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const isVisible = visible === card;

  useEffect(() => {
    if (!user?._id) return;

    const fetchCard = async () => {
      try {
        let res;

        if (card === "Book in Hand") {
          res = await axiosInstance.get(`/user/get/bookinhand/${user._id}`);
          dispatch(addBookInHand(res.data)); // Assuming response is an array
        } else if (card === "Requested Books") {
          res = await axiosInstance.get(`/user/get/requested/${user._id}`);
          dispatch(addRequestedBooks(res.data));
        } else if (card === "Rented History") {
          res = await axiosInstance.get(`/user/get/rented/${user._id}`);
          dispatch(addRentedHistory(res.data));
        }
      } catch (err) {
        console.error(`Failed to load ${card}`, err);
      }
    };

    fetchCard();
  }, [dispatch, user, card]);

  const getBookName = (v) => v.bookId?.bookname || v.bookname || "Unknown Title";
  const getAuthorName = (v) => v.bookId?.authorname || v.authorname || "Unknown Author";

  return (
    <>
      <div
        onClick={() => handle(card)}
        className="bg-gradient-to-r from-slate-600 to-slate-500 text-white flex justify-between items-center p-3 rounded-md cursor-pointer"
      >
        <p>{card}</p>
        <AiOutlineDown className={`transform ${isVisible ? "rotate-180" : ""}`} />
      </div>

      <div
        style={{ display: isVisible ? "block" : "none" }}
        className="bg-slate-400 p-4 mt-2 rounded-md max-h-64 overflow-auto"
      >
        {book?.length > 0 ? (
          book.map((v, i) => (
            <div key={i} className="border-b border-gray-500 py-3">
              <p className="font-semibold">{getBookName(v)}</p>
              <span className="text-slate-900 text-sm">by {getAuthorName(v)}</span>

              {v.from_date && (
                <div className="text-xs">From: {v.from_date}</div>
              )}
              {v.to_date && (
                <div className="text-xs">Till: {v.to_date}</div>
              )}
              {v.amount && (
                <div className="text-xs">Amount: ₹{v.amount}</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center">
            <img src={blank} alt="Nothing to show" className="mx-auto w-36 h-36" />
            <p className="font-bold text-slate-900 mt-2">Nothing to show!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ExtrasInfoCard;
