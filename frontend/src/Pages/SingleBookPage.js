// src/Pages/SingleBookPage.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import CardTemplate from "../components/CardTemplate";
import axiosInstance from "../api/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { open } from "../action";

const SingleBookPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // location.pathname is e.g. "/book/6123abcd..."
  const bookId = location.pathname.split("/book/")[1];
  const [bookData, setBookData] = useState(null);
  const [related, setRelated] = useState([]);
  const dispatch = useDispatch();
  const toggler = useSelector((state) => state.toggler);

  useEffect(() => {
    const getBookDetail = async () => {
      try {
        const res = await axiosInstance.get(`/books/${bookId}`);
        setBookData(res.data);
        // Also fetch all books of the same genre to show “Related” (up to 4):
        const sameType = await axiosInstance.get(
          `/books/all/${encodeURIComponent(res.data.type)}`
        );
        // Exclude this book and take up to 4 others:
        const filtered = sameType.data.filter((b) => b._id !== bookId).slice(0, 4);
        setRelated(filtered);
      } catch (err) {
        console.error("Error fetching book:", err.response?.data || err);
      }
    };
    getBookDetail();
  }, [bookId]);

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
      <div
        style={{ position: !toggler?.status ? "relative" : "fixed" }}
        className="w-[100%] h-max bg-gray-900 pt-[120px] pl-10 md:pl-5 md:pt-[80px] pb-20"
      >
        <div className="flex flex-row md:flex-col items-start justify-between text-white">
          {/* Left: Book Image */}
          <div className="w-[300px] h-[450px] border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg">
            <img
              src={bookData.bookImage}
              alt={bookData.bookname}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Book Details */}
          <div className="flex-1 ml-8 md:ml-0 mt-4">
            <h1 className="text-4xl font-semibold mb-4">
              {bookData.bookname}
            </h1>
            <p className="text-xl mb-2">By {bookData.authorname}</p>
            <p className="mb-4">Genre: {bookData.type}</p>
            <p className="mb-4">Rating: {bookData.rating || "N/A"}</p>
            <p className="mb-4">Price (per day): ₹{bookData.price}</p>

            <button
              onClick={() => {
                navigate(`/book/request/${bookId}`);
              }}
              className="mt-6 px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
            >
              Request This Book
            </button>
          </div>
        </div>

        {/* RELATED BOOKS SECTION */}
        <div className="mt-12">
          <h2 className="text-2xl text-white mb-4">Related Books</h2>
          <div className="grid grid-cols-4 gap-6 md:grid-cols-2 sm:grid-cols-1">
            {related.length > 0 ? (
              related.map((b) => (
                <CardTemplate
                  key={b._id}
                  {...b}
                  origin="related"
                  onClick={() => navigate(`/book/${b._id}`)}
                />
              ))
            ) : (
              <p className="text-gray-400">No related titles</p>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </>
  );
};

export default SingleBookPage;
