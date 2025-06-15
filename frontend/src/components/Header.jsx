// src/components/Header.jsx
import React from "react";
import { FaRegBell } from "react-icons/fa";
import ProfileCard from "./ProfileCard";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { open, close } from "../action";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const toggleStatus = useSelector((state) => state.toggler.status);
  const dispatch = useDispatch();

  const handleToggler = () => {
    toggleStatus ? dispatch(close()) : dispatch(open());
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-green-800 shadow">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/books">
          <span className="text-white text-2xl font-bold">BibloSphere</span>
        </Link>
        <SearchBar className="flex-grow max-w-xl mx-4" />
        <div className="flex items-center space-x-4">
          <FaRegBell className="text-white text-xl cursor-pointer" />
          <button
            onClick={() => navigate("/favourite")}
            className="text-white text-sm hover:underline"
          >
            Favourites
          </button>
          <button
            onClick={handleToggler}
            className="text-white text-sm hover:underline"
          >
            Profile
          </button>
        </div>
      </div>
      {toggleStatus && (
        <div className="container mx-auto mt-14">
          <ProfileCard />
        </div>
      )}
    </header>
  );
};

export default Header;
