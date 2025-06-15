// src/Pages/BooksPage.js

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import BookSlider from "../components/BookSlider";
import { useSelector, useDispatch } from "react-redux";
import { addInitFavBooks } from "../action";
import axiosInstance from "../api/axiosInstance";

const BooksPage = () => {
  const dispatch = useDispatch();
  const booksState = useSelector((state) => state.books);
  console.log("Books from Redux:", booksState); // Check what’s inside

  const userState = useSelector((state) => state.user);
  const toggler = useSelector((state) => state.toggler);
  const [favMsg, setFavMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Utility: shuffle a copy of an array
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Five genres to display:
  const GENRES = [
    "Personal Growth",
    "History",
    "Leadership & Entrepreneurship",
    "Technology",
    "Health and Fitness",
  ];

  return (
    <>
      <Header />
      <div
        style={{ position: !toggler?.status ? "relative" : "fixed" }}
        className="w-[100%] h-max bg-gradient-to-b from-gray-800 to-gray-700 pt-[130px] pl-20 md:pl-5 md:pt-[80px] pb-20"
      >
        <p
          style={{
            translate: favMsg || errMsg ? "0%" : "-100%",
            background: favMsg ? "green" : "red",
          }}
          className="z-50 fixed top-24 left-0 p-2 pl-5 text-lg transition-all duration-300 text-white shadow-lg border-[2px] border-emerald-900"
        >
          {favMsg ? "Book Added to FAV!" : errMsg || ""}
        </p>

        {/* For each genre, filter the books, shuffle, then take first 10 */}
        {GENRES.map((genre) => {
          const allInGenre = booksState?.books?.filter(
            (b) => b.type === genre
          );
          const tenRandom = allInGenre
            ? shuffleArray(allInGenre).slice(0, 10)
            : [];
          return (
            <div key={genre} className="mb-12">
              <BookSlider
                data={tenRandom}
                title={genre}
                setFavMsg={setFavMsg}
                setErrMsg={setErrMsg}
              />
            </div>
          );
        })}
      </div>
      <MobileNav />
    </>
  );
};

export default BooksPage;
