import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaRegUserCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const columns = [
  "User Image", "User Id", "User name", "Membership",
  "Book in Hand", "Rented History", "Favourites", "Requested Books",
  "Update", "Delete"
];

const UsersBoard = () => {
  const [userData, setUserData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [newInfo, setNewInfo] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/user/");
        setUserData(res.data);
      } catch {}
    };
    fetch();
  }, []);

  const toggleModal = (user) => {
    setModalInfo(user);
    setModal(prev => !prev);
  };

  const handleUserDel = async (user) => {
    try {
      await axiosInstance.delete(`/user/delete/${user._id}`);
      setUserData(prev => prev.filter(u => u._id !== user._id));
    } catch {}
  };

  const commitUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/user/edit", {
        id: modalInfo._id,
        username: newInfo.username,
        email: newInfo.email,
      });
      setModal(false);
    } catch {}
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            {columns.map(c => <th key={c} className="p-2 border">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {userData.map((u, i) => (
            <tr key={i} className="bg-slate-500 text-white">
              <td className="p-2 border text-center"><FaRegUserCircle /></td>
              <td className="p-2 border text-center">{u._id}</td>
              <td className="p-2 border text-center">{u.username}</td>
              <td className="p-2 border text-center">{u.membership ? "Yes" : "No"}</td>
              <td className="p-2 border text-center">{u.bookInHand?.length}</td>
              <td className="p-2 border text-center">{u.rentedHistory?.length}</td>
              <td className="p-2 border text-center">{u.favourites?.length}</td>
              <td className="p-2 border text-center">{u.requestedBooks?.length}</td>
              <td className="p-2 border text-center">
                <button onClick={() => toggleModal(u)} className="bg-emerald-500 px-2 py-1 rounded">UPDATE</button>
              </td>
              <td className="p-2 border text-center">
                <button onClick={() => handleUserDel(u)} className="bg-red-500 px-2 py-1 rounded">DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-200 p-5 rounded shadow">
          <div className="flex justify-end">
            <MdCancel onClick={() => setModal(false)} className="cursor-pointer" />
          </div>
          <form onSubmit={commitUpdate} className="flex flex-col">
            <label>Username</label>
            <input
              defaultValue={modalInfo.username}
              onChange={e => setNewInfo(prev => ({ ...prev, username: e.target.value }))}
              className="mb-3 p-2 bg-slate-400 rounded"
            />
            <label>Email</label>
            <input
              defaultValue={modalInfo.email}
              onChange={e => setNewInfo(prev => ({ ...prev, email: e.target.value }))}
              className="mb-3 p-2 bg-slate-400 rounded"
            />
            <button type="submit" className="bg-emerald-600 text-white p-2 rounded">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersBoard;
