// src/components/RequestsBoard.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { acceptReq, declineReq } from "../../action";

const columns = [
  "S.NO",
  "User Id",
  "Book Id",
  "Book Name",
  "Author Name",
  "Genre",
  "Rent From",
  "Rent Till",
  "Amount",
  "Accept",
  "Decline",
];

const RequestsBoard = () => {
  const dispatch = useDispatch();
  const [reqData, setReqData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/books/request/all")
      .then(res => setReqData(res.data))
      .catch(console.error);
  }, []);

  const handleDecision = (entry, approve) => {
    const { userId, _id: requestId } = entry;
    axiosInstance
      .post("/books/request/one", { userId, requestId, approve })
      .then(() => {
        if (approve) dispatch(acceptReq(requestId));
        else       dispatch(declineReq(requestId));
        setReqData(prev => prev.filter(r => r._id !== requestId));
      })
      .catch(console.error);
  };

  if (!reqData.length) {
    return <p className="p-4 text-center">No pending requests.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            {columns.map(col => (
              <th key={col} className="py-2 px-4 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reqData.map((r, idx) => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{idx + 1}</td>
              <td className="py-2 px-4">{r.userId}</td>
              <td className="py-2 px-4">{r.bookId}</td>
              <td className="py-2 px-4">{r.bookname}</td>
              <td className="py-2 px-4">{r.authorname}</td>
              <td className="py-2 px-4">{r.genre}</td>
              <td className="py-2 px-4">{r.from_date}</td>
              <td className="py-2 px-4">{r.to_date}</td>
              <td className="py-2 px-4">₹{r.amount}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDecision(r, true)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  ACCEPT
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDecision(r, false)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  DECLINE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsBoard;
