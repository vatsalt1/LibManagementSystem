import React, { useState } from "react";
import createImg from "../../assets/Create-amico.svg";
import axiosInstance from "../../api/axiosInstance";

const CreateBook = () => {
  const [msg, setMsg] = useState("");
  const [book, setBook] = useState({
    bookname: "",
    authorname: "",
    rating: "",
    type: "",
    bookImage: "",
    price: "",
  });

  const change = (f, v) => setBook((b) => ({ ...b, [f]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/books/create", book);
      setMsg(res.data.message || "Created");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex pb-10">
      {msg && <p className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white p-2 rounded">{msg}</p>}
      <form onSubmit={submit} className="flex flex-col">
        {[
          ["bookname", "Book name"],
          ["authorname", "Author name"],
          ["rating", "Rating"],
          ["type", "Genre"],
          ["bookImage", "Image URL"],
          ["price", "Price/day"],
        ].map(([f, p]) => (
          <input
            key={f}
            value={book[f]}
            onChange={(e) => change(f, e.target.value)}
            placeholder={p}
            required
            className="bg-slate-500 p-3 mb-3 text-white rounded-xl outline-none"
          />
        ))}
        <button className="bg-pink-700 p-3 text-white rounded-xl">Create Book</button>
      </form>
      <img src={createImg} alt="" className="hidden sm:block w-1/2" />
    </div>
  );
};

export default CreateBook;
