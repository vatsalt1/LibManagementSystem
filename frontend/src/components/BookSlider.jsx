// src/components/BookSlider.jsx

import React from "react";
import axiosInstance from "../api/axiosInstance";
import { BsStarFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import star from "../assets/star-dynamic-premium.png";
import CardTemplate from "./CardTemplate";
import { addProgFavBooka, open } from "../action";
import useCurrentUser from "../hooks/useCurrentUser";

const BookSlider = ({ data, title, setFavMsg, setErrMsg }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favourites = useSelector((s) => s.books.favourite);
  const user = useCurrentUser();

  const handleBook = (b) => {
    navigate(`/book/${b._id}`);
  };

  const handleFav = async (b) => {
    if (!user) {
      return dispatch(open());
    }
    try {
      const res = await axiosInstance.put("/user/addFav", {
        userId: user._id,
        bookId: b._id,
      });
      setFavMsg(res.data.message);
      dispatch(addProgFavBooka(b._id));
      setTimeout(() => setFavMsg(""), 3000);
    } catch (err) {
      setErrMsg(err.response?.data?.message);
      setTimeout(() => setErrMsg(""), 3000);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-3xl font-bold text-slate-200">{title}</p>
      <div className="flex overflow-x-auto no-scrollbar p-1">
        {data?.length ? (
          data.map((b) => (
            <div key={b._id} className="mx-2 cursor-pointer">
              <div onClick={() => handleBook(b)} className="w-[200px] h-[300px]">
                <img
                  src={b.bookImage}
                  alt={b.bookname}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <div className="flex justify-between items-center pr-2">
                <div className="flex items-center bg-gradient-to-r from-emerald-600 to-emerald-300 px-2 mt-1 rounded-sm">
                  <img src={star} alt="" className="w-6" />
                  <p className="ml-1 font-bold text-slate-800">{b.rating}</p>
                </div>
                <BsStarFill
                  onClick={() => handleFav(b)}
                  style={{ color: favourites?.includes(b._id) ? "orange" : "white" }}
                  className="mt-1"
                />
              </div>
              <p className="mt-1 font-bold text-white text-lg">
                {b.bookname.slice(0, 17)}...
              </p>
              <p className="text-slate-200 text-sm">{b.authorname}</p>
              <p className="text-white font-semibold">₹{b.price}/day</p>
            </div>
          ))
        ) : (
          <CardTemplate />
        )}
      </div>
    </div>
  );
};

export default BookSlider;
