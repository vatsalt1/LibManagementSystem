import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const cols = [
  "S.NO","User Id","Book Id","Book Name","Author","Genre",
  "From","To","Amount","Returned","Action"
];

const RentedBoard = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    axiosInstance.get("/books/rentals/all").then((r) => setRentals(r.data));
  }, []);

  const markReturned = async (r) => {
    await axiosInstance.put("/books/returned/update", {
      _id: r._id, userId: r.userId, bookId: r.bookId
    });
    setRentals((prev) =>
      prev.map((x) => (x._id === r._id ? { ...x, returned: true } : x))
    );
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-800 text-white">
          {cols.map((c) => <th key={c} className="p-2 border">{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rentals.map((r,i) => (
          <tr key={r._id} className="bg-slate-500 text-white">
            <td className="p-2 border">{i+1}</td>
            <td className="p-2 border">{r.userId}</td>
            <td className="p-2 border">{r.bookId}</td>
            <td className="p-2 border">{r.bookname}</td>
            <td className="p-2 border">{r.authorname}</td>
            <td className="p-2 border">{r.genre}</td>
            <td className="p-2 border">{r.from_date}</td>
            <td className="p-2 border">{r.to_date}</td>
            <td className="p-2 border">{r.amount}</td>
            <td className="p-2 border">{r.returned ? "Yes" : "No"}</td>
            <td className="p-2 border">
              {!r.returned && (
                <button onClick={() => markReturned(r)} className="bg-emerald-500 px-2 rounded">Received</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RentedBoard;
