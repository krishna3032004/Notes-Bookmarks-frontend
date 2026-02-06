"use client";

import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { requireAuth } from "@/lib/requireAuth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    requireAuth(); // 🔐 protect page
    setUser(getUser());
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a121f]  flex items-center justify-center">
      <div className="bg-[#0f1a29] p-6 rounded-lg shadow w-96 border border-[#243042] ">
        <h1 className="text-2xl font-bold text-white mb-7">Profile</h1>

        <div className="space-y-2 text-[#94a3b8]">
          <p>
            <span className="font-semibold text-white">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold text-white">Email:</span> {user.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full cursor-pointer bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
