import React from "react";
export const URL = import.meta.env.VITE_BACKEND_API_URL;
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Email from "./Components/ForgotPassword/Email";
import Otp from "./Components/ForgotPassword/Otp";
import ResetPassword from "./Components/ForgotPassword/ResetPassword";
import Category from "./Components/Category";
import MovieInfo from "./Components/MovieInfo";
import AddMovie from "./Components/AddMovie";
import CastInfo from "./Components/CastInfo";
import CastCategory from "./Components/CastCategory";
import MoreMovies from "./Components/MoreMovies";
import EditMovie from "./Components/EditMovie";
import CategoryMore from "./Components/CategoryMore";
import Profile from "./Components/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={"/home"} />} />
          <Route path="home" element={<Home />} />
          <Route path="accounts/profile" element={<Profile />} />
          <Route path="casting" element={<MoreMovies />} />
          <Route path="category" element={<CategoryMore />} />
          <Route path="category/movie/:name" element={<Category />} />
          <Route path="category/casting/:name" element={<CastCategory />} />
          <Route path="movie/:name" element={<MovieInfo />} />
          <Route path="casting/:name" element={<CastInfo />} />
          <Route path="movie/add/new" element={<AddMovie />} />
          <Route path="movie/edit/:id" element={<EditMovie />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot/password/verify/email" element={<Email />} />
          <Route path="forgot/password/verify/otp/:email" element={<Otp />} />
          <Route path="forgot/password/reset/:id" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
