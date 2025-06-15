import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { addRequestedBooks, open } from "../action";
import useCurrentUser from '../hooks/useCurrentUser';

const toISO = (d) => new Date(d).toISOString().slice(0, 10);
const daysBetween = (a, b) =>
  Math.round(Math.abs(new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24));

const GetBookForm = ({ defaultDetail }) => {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(defaultDetail.price);
  const [msg, setMsg] = useState({ ok: false, text: "" });

  useEffect(() => {
    setFrom(toISO(new Date()));
  }, []);

  useEffect(() => {
    if (from && to) {
      const days = daysBetween(from, to) + 1;
      setAmount(days * defaultDetail.price);
    }
  }, [from, to, defaultDetail.price]);

  const refreshReq = async () => {
    const res = await axiosInstance.get(`/user/${user._id}`);
    dispatch(addRequestedBooks(res.data.requestedBooks));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return dispatch(open());
    try {
      const res = await axiosInstance.post("/books/request", {
        userId: user._id,
        bookId: defaultDetail._id,
        bookname: defaultDetail.bookname,
        authorname: defaultDetail.authorname,
        genre: defaultDetail.type,
        from_date: from,
        to_date: to,
        amount,
      });
      setMsg({ ok: true, text: "Request sent" });
      refreshReq();
    } catch {
      setMsg({ ok: true, text: "Request failed" });
    }
    setTimeout(() => setMsg({ ok: false, text: "" }), 3000);
  };

  return (
    <div className="ml-64 sm:ml-0 sm:mt-7">
      {msg.ok && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white p-2 rounded">
          {msg.text}
        </div>
      )}
      <p className="text-5xl font-bold text-white sm:text-center">
        Request Form
      </p>
      <form onSubmit={submit} className="flex flex-col mt-5">
        {["_id", "bookname", "authorname", "type"].map((f) => (
          <input
            key={f}
            type="text"
            readOnly
            value={defaultDetail[f]}
            className="bg-slate-500 p-3 mb-3 text-white rounded-xl outline-none"
          />
        ))}
        <div className="flex mb-3">
          <div className="mr-4">
            <label className="text-white">From *</label>
            <input
              type="date"
              min={toISO(new Date())}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-slate-500 p-3 text-white rounded-xl outline-none"
              required
            />
          </div>
          <div>
            <label className="text-white">To *</label>
            <input
              type="date"
              min={from}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-slate-500 p-3 text-white rounded-xl outline-none"
              required
            />
          </div>
        </div>
        <div className="relative mb-3">
          <span className="absolute left-4 top-4 text-white font-semibold">₹</span>
          <input
            readOnly
            value={amount}
            className="bg-slate-500 p-3 pl-12 text-white rounded-xl outline-none w-[400px] sm:w-full"
          />
        </div>
        <button className="bg-pink-700 p-3 text-white rounded-xl">
          Request the Book
        </button>
      </form>
    </div>
  );
};

export default GetBookForm;
