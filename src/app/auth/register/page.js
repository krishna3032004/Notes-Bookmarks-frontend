"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message);

    alert("OTP sent to your email! Please verify.");
    setShowOtp(true);
  };

  // Step 2: Verify OTP & Create Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message);

    alert("Account created successfully! You can login now.");
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a121f] ">
      <form
        onSubmit={showOtp ? handleVerifyOtp : handleRegister}
        className=" p-6 bg-[#0f1a29] ring-2 ring-blue-400 rounded border border-[#243042]  shadow w-80"
      >
        <h1 className="text-2xl text-[#00e5ff]  font-bold mb-4">
          {showOtp ? "Verify OTP" : "Register"}
        </h1>

        {!showOtp && (
          <>
            <input
              className="w-full mb-3 p-2 border border-[#243042]  bg-black  rounded-lg"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full mb-3 p-2 border border-[#243042]  bg-black  rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full mb-3 p-2 border border-[#243042]  bg-black  rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {showOtp && (
          <input
            className="w-full mb-3 p-2 border border-[#243042]  bg-black rounded-lg"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        <button
          className="w-full bg-[#00e5ff]  text-black p-2 rounded mb-3"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : showOtp
            ? "Verify & Create Account"
            : "Register"}
        </button>

        {!showOtp && (
          <div className="text-center text-sm text-gray-600 mt-2">
            {/* Already have an account?{" "} */}
            <span className="hover:text-blue-600 cursor-pointer">
              
              <a href="/auth/login">Already have an account?{" "}Login</a>
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
