import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";  // Removed Router wrapper
import { useDispatch } from "react-redux";
import axiosInstance from "./api/axiosInstance";
import { addBook, setX, setY } from "./action";

// Layout components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import WelcomePage from "./Pages/WelcomePage";
import BooksPage from "./Pages/BooksPage";
import SearchPage from "./Pages/SearchPage";
import FavouritePage from "./Pages/FavouritePage";
import ProfilePage from "./Pages/ProfilePage";
import SingleBookPage from "./Pages/SingleBookPage";
import RequestForm from "./Pages/RequestForm";
import AdminPage from "./Pages/AdminPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.innerWidth > 767) {
      dispatch(setX());
    } else {
      dispatch(setY());
    }
    axiosInstance
      .get("/books/")
      .then((res) => dispatch(addBook(res.data)))
      .catch((err) => console.error(err));

    document.title = "BibloSphere Library";
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-sky-200">
      <Header className="bg-green-800" />
      <main className="flex-grow mt-14 pt-4 px-4">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favourite" element={<FavouritePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/book/:id" element={<SingleBookPage />} />
          <Route path="/book/request/:id" element={<RequestForm />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

