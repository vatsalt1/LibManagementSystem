import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginUser, loginFailed } from "../action";

const LoginForm = ({ changeForm }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((s) => s.user);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    dispatch(loginStart());
    try {
      const res = await axiosInstance.post("/user/login", creds);
      dispatch(loginUser(res.data));
    } catch (err) {
      const m = err.response?.data?.message || "Login failed";
      dispatch(loginFailed(m));
      setMsg(m);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <p className="text-2xl font-bold text-center">Login</p>
      {(error || msg) && <p className="text-red-600 text-center">{error || msg}</p>}
      <form onSubmit={submit} className="space-y-4 mt-4">
        <input
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button className="w-full bg-rose-600 text-white p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <span onClick={() => changeForm("Register")} className="text-blue-700 underline cursor-pointer">
          Register
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
