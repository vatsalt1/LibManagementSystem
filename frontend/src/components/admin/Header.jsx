// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

const Header = ({ className = "" }) => {
  const [req, setReq] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axiosInstance.get("/books/request/all").then((r) => setReq(r.data));
  }, []);

  return (
    <header className={`fixed top-0 flex justify-between items-center w-full h-12 p-4 text-white ${className}`}>  {/* dark green via className */}
      <p className="font-bold text-xl">BibloSphere (Dashboard)</p>
      <div onClick={() => setShow((s) => !s)} className="relative cursor-pointer">
        {req.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs px-1">
            {req.length}
          </span>
        )}
        <FaRegBell />
      </div>
      {show && (
        <div className="absolute top-12 right-4 bg-slate-500 p-2 rounded">
          Requests: {req.length}
        </div>
      )}
    </header>
  );
};

export default Header;
