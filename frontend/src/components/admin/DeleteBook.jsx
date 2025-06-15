// src/components/admin/DeleteBook.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { removeBook } from "../../action";

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .get("/books/")
      .then((res) => setBooks(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/books/${id}`)
      .then(() => {
        dispatch(removeBook(id)); // Update Redux
        setBooks((prev) => prev.filter((b) => b._id !== id)); // Update local state
      })
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Books</h2>
      {books.length === 0 ? (
        <p className="text-gray-600">No books found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-2">{b.bookname}</td>
                <td className="p-2">{b.authorname}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeleteBook;
