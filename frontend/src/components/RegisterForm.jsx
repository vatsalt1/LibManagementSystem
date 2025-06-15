import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { loginStart, loginFailed } from "../action"; 

const RegisterForm = ({ changeForm }) => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    try {
      const res = await axiosInstance.post("/user/register", info);
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        email: info.email,
        otp,
      });
      alert(res.data.message);
      changeForm("Login");
    } catch (err) {
      setMsg(err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      {step === 1 ? (
        <>
          <p className="text-2xl font-bold text-center">Register</p>
          {msg && <p className="text-red-600 text-center">{msg}</p>}
          <input
            onChange={(e) => setInfo({ ...info, username: e.target.value })}
            placeholder="Username"
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            placeholder="Email"
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            type="password"
            onChange={(e) => setInfo({ ...info, password: e.target.value })}
            placeholder="Password"
            className="w-full border p-2 rounded mb-3"
            required
          />
          <button onClick={sendOtp} className="w-full bg-green-600 text-white p-2 rounded">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-center">Verify OTP</p>
          {msg && <p className="text-red-600 text-center">{msg}</p>}
          <input
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full border p-2 rounded mb-3 text-center"
            required
          />
          <button onClick={verifyOtp} className="w-full bg-blue-600 text-white p-2 rounded">
            Verify OTP
          </button>
        </>
      )}
      <p className="mt-4 text-center text-sm">
        {step === 1
          ? "Already have an account? "
          : "Back to "}
        <span onClick={() => changeForm("Login")} className="text-blue-700 underline cursor-pointer">
          {step === 1 ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
