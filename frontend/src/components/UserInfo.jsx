import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ExtrasInfoCard from "./ExtrasInfoCard";
import { logout } from "../action";
import useCurrentUser from '../hooks/useCurrentUser';

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useCurrentUser();     // outer slice
  const extras = useSelector((s) => s.extras);      // holds requestedBooks, etc.
  const [visible, setVisible] = useState("");

  const handleVisibility = (value) =>
    setVisible((v) => (v === value ? "" : value));

  const handleLogout = () => {
    dispatch(logout());
   localStorage.removeItem("user");
  // send them back to the welcome page
  navigate("/", { replace: true });
  };

  return (
    <>
      <p className="text-lg text-gray-300 font-semibold bg-pink-800 py-2 px-2 rounded-md sm:w-[100%] sm:mt-5">
        Hello, <span className="text-white">{user?.username}</span>
      </p>

      <div className="flex flex-col mt-4 space-y-2">
        <ExtrasInfoCard
          card="Book in Hand"
          book={extras.bookInHand}
          handle={handleVisibility}
          visible={visible}
        />
        <ExtrasInfoCard
          card="Requested Books"
          book={extras.requestedBooks}
          handle={handleVisibility}
          visible={visible}
        />
        <ExtrasInfoCard
          card="Rented History"
          book={extras.rentedHistory}
          handle={handleVisibility}
          visible={visible}
        />
      </div>

      <div className="mt-5 space-y-2">
        {user?.isAdmin && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full bg-emerald-600 p-3 rounded-md text-white font-semibold"
          >
            View Dashboard
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 p-3 rounded-md text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default UserInfo;
