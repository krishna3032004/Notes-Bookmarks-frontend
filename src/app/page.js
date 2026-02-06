"use client";

import { useEffect ,useState} from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { getToken } from "@/lib/auth";


export default function Home() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // const user = getAuth(); // check if logged in
    setToken(getToken());
  }, []);

  return (
    <main className="min-h-screen bg-[#0a121f] flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-[#00e5ff] mb-6 font-mono">
        Notes & Bookmarks Manager
      </h1>
      <p className="text-[#94a3b8] text-lg md:text-xl mb-6 max-w-xl">
        Keep all your notes, ideas, and bookmarks organized in one place. Fast, secure, and easy to use.
      </p>
      <div className="flex gap-4">
        {token ?

        <button
          onClick={() => router.push("/notes")}
          className="px-6 py-3 border border-[#00e5ff] text-[#00e5ff] rounded-lg font-semibold cursor-pointer transition"
        >
          Notes
        </button>
        :
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-3 border border-[#00e5ff] text-[#00e5ff] rounded-lg font-semibold cursor-pointer transition"
        >
          Login
        </button>}
        {token ?
        <button
          onClick={() => router.push("/auth/register")}
          className="px-6 py-3 bg-[#00e5ff] text-[#0a121f] rounded-lg font-semibold cursor-pointer hover:bg-[#00c0e0] transition"
        >
          Bookmarks
        </button>:
        <button
          onClick={() => router.push("/auth/register")}
          className="px-6 py-3 bg-[#00e5ff] text-[#0a121f] rounded-lg font-semibold cursor-pointer hover:bg-[#00c0e0] transition"
        >
          Register
        </button>}
      </div>
      {/* <p className="text-[#94a3b8] text-sm mt-10">
        Already have an account? <span className="text-[#00e5ff] cursor-pointer" onClick={() => router.push("/auth/login")}>Login here</span>
      </p> */}
    </main>
  );
}
