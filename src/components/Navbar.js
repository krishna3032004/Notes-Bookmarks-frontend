"use client";

import Link from "next/link";
import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger icon

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <nav className="backdrop-blur-xs border-b border-[#243042] bg-[#0a121f] text-white p-5 flex justify-between items-center">
      
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <Link href="/"><span className="text-[#00e5ff] font-bold text-2xl md:text-3xl font-mono hover:scale-105 transition">
          NBM
        </span></Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-5 items-center">
        <Link href="/" className="hover:text-[#00e5ff] font-mono">Home</Link>
        {token && <Link href="/notes" className="hover:text-[#00e5ff] font-mono">Notes</Link>}
        {token && <Link href="/bookmarks" className="hover:text-[#00e5ff] font-mono">Bookmarks</Link>}
        {!token ? (
          <Link
            href="/auth/login"
            className="border text-[#00e5ff] border-[#00e5ff] rounded-lg px-3 py-2 hover:bg-[#00e5ff] hover:text-[#0a121f] transition"
          >
            Login
          </Link>
        ) : (
          <Link
            href="/profile"
            className="border text-[#00e5ff] border-[#00e5ff] rounded-lg px-3 py-2 hover:bg-[#00e5ff] hover:text-[#0a121f] transition"
          >
            Profile
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      {token && (
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#00e5ff] text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && token && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a121f] border border-[#243042] rounded-lg shadow-lg flex flex-col py-2 z-50 md:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 hover:bg-[#243042] transition"
          >
            Home
          </Link>
          <Link
            href="/notes"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 hover:bg-[#243042] transition"
          >
            Notes
          </Link>
          <Link
            href="/bookmarks"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 hover:bg-[#243042] transition"
          >
            Bookmarks
          </Link>
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 hover:bg-[#243042] transition"
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
