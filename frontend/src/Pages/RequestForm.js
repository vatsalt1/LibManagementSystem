import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import axiosInstance from "../api/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { addRequestedBooks } from "../action";
import useCurrentUser from '../hooks/useCurrentUser';

const RequestForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const bookId = location.pathname.split("/book/request/")[1];
  const [bookData, setBookData] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

   
   const user    = useCurrentUser();
   const userId  = user?._id;

  useEffect(() => {
    axiosInstance
      .get(`/books/${bookId}`)
      .then((res) => setBookData(res.data))
      .catch((err) =>
        console.error("Error fetching book detail:", err.response?.data || err)
      );
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!userId) {
      setErrorMsg("You must be logged in to request a book.");
      return;
    }
    if (!fromDate || !toDate) {
      setErrorMsg("Both dates are required.");
      return;
    }

    const start = new Date(fromDate),
      end = new Date(toDate);
    if (end < start) {
      setErrorMsg("“To” date cannot be earlier than “From” date.");
      return;
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = days * bookData.price;

    try {
      // 1) post the request
      await axiosInstance.post("/books/request", {
        userId,
        bookId: bookData._id,
        bookname: bookData.bookname,
        authorname: bookData.authorname,
        genre: bookData.type,
        from_date: fromDate,
        to_date: toDate,
        amount: totalAmount,
      });

      // 2) fetch the updated requestedBooks for the user
      const resp = await axiosInstance.get(`/user/${userId}`);
      dispatch(addRequestedBooks(resp.data.requestedBooks));

      // 3) show success
      setSuccessMsg("Request submitted!");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Failed to submit request"
      );
    }
  };

  if (!bookData) {
    return (
      <>
        <Header />
        <div className="pt-40 text-center text-white">Loading…</div>
        <MobileNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-[120px] pb-20 px-10 bg-gray-900 min-h-screen text-white">
        <h2 className="text-3xl font-semibold mb-6">Request Book</h2>

        {/* Book Info */}
        <div className="flex flex-row md:flex-col bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <img
            src={bookData.bookImage}
            alt=""
            className="w-[200px] h-[300px] object-cover rounded-lg"
          />
          <div className="ml-6 md:ml-0 md:mt-4">
            <h3 className="text-2xl font-medium">{bookData.bookname}</h3>
            <p className="mt-2">By {bookData.authorname}</p>
            <p className="mt-1">Genre: {bookData.type}</p>
            <p className="mt-1">Price (per day): ₹{bookData.price}</p>
          </div>
        </div>

        {/* Request Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md"
        >
          <div className="mb-4">
            <label className="block text-sm mb-1">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <p className="mb-4 text-gray-300">
            You’ll pay:{" "}
            <span className="font-semibold">
              {fromDate && toDate
                ? `₹${(Math.floor(
                    (new Date(toDate) - new Date(fromDate)) /
                      (1000 * 60 * 60 * 24)
                  ) +
                    1) *
                    bookData.price}`
                : "—"}
            </span>
          </p>

          {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 mb-4">{successMsg}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white transition"
          >
            Submit Request
          </button>
        </form>
      </div>
      <MobileNav />
    </>
  );
};

export default RequestForm;
