"use client";

import { useState } from "react";
import { saveAuth } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // forgot password flow
  const [forgotStage, setForgotStage] = useState(0); // 0 = email, 1 = otp+newPass
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message);

    saveAuth(data);
    window.location.href = "/notes";
  };

  // Step 1: send OTP
  const handleForgotEmail = async () => {
    if (!email) return alert("Enter your email first");
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message);

    alert("OTP sent to your email!");
    setForgotStage(1);
  };

  // Step 2: verify OTP + new password
  const handleForgotOtp = async () => {
    if (!otp || !newPassword) return alert("Enter OTP and new password");
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message);

    alert("Password reset successfully! You can login now.");
    setForgotStage(0);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center bg-[#0a121f] justify-center ">
      <div className=" p-6 bg-[#0f1a29] ring-2 ring-blue-400 rounded border border-[#243042] shadow w-80">
        {forgotStage === 0 ? (
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl  text-[#00e5ff] font-bold mb-4">Login</h1>

            <input
              className="w-full mb-3  border border-[#243042]  bg-black p-2  rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full mb-3 p-2  border border-[#243042]  bg-black rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full bg-[#00e5ff]  text-black p-2 rounded-lg mb-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex justify-between text-sm text-gray-600">
              <span
                className="hover:text-blue-600 cursor-pointer"
                onClick={handleForgotEmail}
              >
                Forgot Password?
              </span>
              <Link href="/auth/register" className="hover:text-blue-600">
                New user? Register
              </Link>
            </div>
          </form>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <p className="text-gray-600 mb-3">Enter the OTP sent to {email}</p>

            <input
              className="w-full mb-3 p-2 border border-[#243042]  bg-black rounded-lg"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              className="w-full mb-3 p-2 boborder border-[#243042]  bg-blackrder rounded-lg"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              className="w-full  bg-[#00e5ff]  text-black p-2 rounded-lg mb-3"
              disabled={loading}
              onClick={handleForgotOtp}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

            <button
              className="w-full text-blue-600 underline"
              onClick={() => setForgotStage(0)}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
