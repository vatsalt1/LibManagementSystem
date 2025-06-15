// src/components/admin/UpdateBook.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { updateBook } from "../../action";

const UpdateBook = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ bookname: "", authorname: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .get("/books/")
      .then((res) => setBooks(res.data))
      .catch(console.error);
  }, []);

  const handleEditClick = (book) => {
    setEditBook(book._id);
    setForm({ bookname: book.bookname, authorname: book.authorname });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (id) => {
    const updatedBook = { ...form, _id: id };
    axiosInstance
      .put(`/books/${id}`, updatedBook)
      .then((res) => {
        dispatch(updateBook(res.data));
        setBooks((prev) =>
          prev.map((b) => (b._id === id ? res.data : b))
        );
        setEditBook(null);
        setForm({ bookname: "", authorname: "" });
      })
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Update Books</h2>
      {books.length === 0 ? (
        <p className="text-gray-600">No books available.</p>
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
                <td className="p-2">
                  {editBook === b._id ? (
                    <input
                      name="bookname"
                      value={form.bookname}
                      onChange={handleChange}
                      className="border p-1"
                    />
                  ) : (
                    b.bookname
                  )}
                </td>
                <td className="p-2">
                  {editBook === b._id ? (
                    <input
                      name="authorname"
                      value={form.authorname}
                      onChange={handleChange}
                      className="border p-1"
                    />
                  ) : (
                    b.authorname
                  )}
                </td>
                <td className="p-2">
                  {editBook === b._id ? (
                    <button
                      onClick={() => handleUpdate(b._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(b)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpdateBook;
