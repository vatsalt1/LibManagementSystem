import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { addInitFavBooks, deleteFav } from "../action";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import emptyStore from "../assets/empty-store.svg";
import BookCard from "../components/BookCard";
import useCurrentUser from '../hooks/useCurrentUser';

const FavouritePage = () => {
  const dispatch = useDispatch();
  const { books, favourite } = useSelector((s) => s.books);
  
  const user = useCurrentUser();
  const [msg, setMsg] = useState("");

  const favs = books.filter(b => favourite.includes(b._id));

  const getFavsFromAPI = async () => {
    try {
      const res = await axiosInstance.get(`/user/getfav/${user._id}`);
      console.log("User state in Redux:", user);
      console.log("User ID used in request:", user?._id);
      dispatch(addInitFavBooks(res.data));
    } catch {}
  };

  const deleteFavourite = async (b) => {
    try {
      const res = await axiosInstance.put("/user/deletefav", {
        userId: user._id, bookId: b._id
      });
      setMsg(res.data.message);
      setTimeout(() => setMsg(""), 3000);
      dispatch(deleteFav(b._id));
    } catch {}
  };

  useEffect(() => {
    if (user) getFavsFromAPI();
  }, [user,getFavsFromAPI]);

  return (
    <>
      <Header />
      {msg && <p className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white p-2 rounded">{msg}</p>}
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-800 to-gray-700 min-h-screen">
        <p className="text-5xl font-bold text-white mb-8">Favourite Books</p>
        <div className="flex flex-wrap gap-4">
          {favs.length > 0 ? (
            favs.map((b) => (
              <BookCard key={b._id} data={b} clear delFav={deleteFavourite} />
            ))
          ) : (
            <div className="w-full text-center">
              <img src={emptyStore} alt="" className="mx-auto w-48 h-48" />
              <p className="text-white text-2xl mt-4">Favourite list is empty!</p>
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </>
  );
};

export default FavouritePage;
