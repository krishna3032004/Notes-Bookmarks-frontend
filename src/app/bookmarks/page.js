"use client";

import { useEffect, useState } from "react";
import {
    getBookmarks,
    toggleBookmarkFavorite,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    fetchMetadata,
} from "@/lib/api";
import { requireAuth } from "@/lib/requireAuth";

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        tags: "",
    });

    const limit = 6;

    useEffect(() => requireAuth(), []);

    useEffect(() => {
        const timer = setTimeout(() => loadBookmarks(search, page), 500);
        return () => clearTimeout(timer);
    }, [search, page]);

    const loadBookmarks = async (q = "", pageNum = 1) => {
        setLoading(true);
        try {
            const params = { page: pageNum, limit };
            if (q) params.q = q;

            const res = await getBookmarks(params);
            setBookmarks(res.data);
            setHasMore(res.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (id) => {
        await toggleBookmarkFavorite(id);
        loadBookmarks(search, page);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this bookmark?")) return;
        await deleteBookmark(id);
        loadBookmarks(search, page);
    };

    const openCreateModal = () => {
        setEditingBookmark(null);
        setForm({ url: "", title: "", description: "", tags: "" });
        setShowModal(true);
    };

    const openEditModal = (bm) => {
        setEditingBookmark(bm);
        setForm({
            url: bm.url,
            title: bm.title,
            description: bm.description,
            tags: bm.tags?.join(",") || "",
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const tags =
                typeof form.tags === "string"
                    ? form.tags.split(",").map((t) => t.trim())
                    : form.tags;
            
    let bookmarkData = { ...form, tags };

    // ✅ Auto-fetch metadata if title or description is empty
    if (!form.title || !form.description) {
      try {
        const meta = await fetchMetadata(form.url);
        if (!form.title) bookmarkData.title = meta.title || form.url;
        if (!form.description) bookmarkData.description = meta.description || "";
      } catch (err) {
        console.warn("Failed to fetch metadata:", err.message);
        if (!form.title) bookmarkData.title = form.url; // fallback
        if (!form.description) bookmarkData.description = "";
      }
    }

    if (editingBookmark) {
      await updateBookmark(editingBookmark._id, bookmarkData);
    } else {
      await createBookmark(bookmarkData);
    }
            setShowModal(false);
            loadBookmarks(search, page);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <main className="min-h-screen text-white bg-[#0a121f] p-6">
            <h1 className="text-3xl font-bold mb-6 font-sans">Bookmarks 🔖</h1>

            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search bookmarks..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="flex-1 p-3 pl-5 border bg-[#0f1a29] border-gray-800 rounded-3xl shadow-sm outline-none"
                />
                <button
                    onClick={openCreateModal}
                    className="px-6 py-3 cursor-pointer bg-[#0f1a29] hover:border-[#00e5ff80] border font-mono  border-[#243042] text-[#00e5ff] font-semibold rounded-lg shadow transition"
                >
                    + Add Bookmark
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 mt-10">Loading...</p>
            ) : bookmarks.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No bookmarks found</p>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookmarks.map((bm) => (
                            <div
                                key={bm._id}
                                className="bg-[#0f1a29]  p-5 rounded-2xl shadow-md hover:shadow-lg transition relative border border-[#243042]"
                            >
                                <div className="flex justify-between items-start">
                                    <a
                                        href={bm.url}
                                        target="_blank"
                                        className="font-semibold text-white hover:underline text-xl"
                                    >
                                        {bm.title || "Untitled"}
                                    </a>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFavorite(bm._id)}
                                            className="text-xl hover:text-yellow-500 transition"
                                        >
                                            {bm.favorite ? "⭐" : "☆"}
                                        </button>
                                        <button
                                            onClick={() => openEditModal(bm)}
                                            className="text-[#00e5ff] cursor-pointer font-semibold  transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bm._id)}
                                            className="text-red-600 cursor-pointer font-semibold hover:text-red-800 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-3 text-sm">{bm.description}</p>

                                {bm.tags && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {bm.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-[#0a121f] border font-mono  border-[#243042] text-[#00e5ff]  text-xs px-2 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {bookmarks.length > 0 && (hasMore || page > 1) && (
                        <div className="flex justify-center gap-4 mt-10">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 border cursor-pointer bg-[#0f1a29]  border-[#243042] text-[#00e5ff] rounded disabled:opacity-50 hover:bg-gray-400 transition"
                            >
                                Prev
                            </button>

                            <span className="px-4 py-2 font-semibold text-white">
                                Page {page}
                            </span>

                            <button
                                disabled={!hasMore}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 border cursor-pointer bg-[#0f1a29]  border-[#243042] text-[#00e5ff] rounded disabled:opacity-50 hover:bg-gray-400 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-xs  flex justify-center items-center z-50">
                    <div className="bg-[#0f1a29]  p-6 rounded-2xl w-full border border-[#243042] max-w-md shadow-xl animate-slide-in">
                        <h2 className="text-2xl font-bold mb-5 text-[#00e5ff]">
                            {editingBookmark ? "Edit Bookmark" : "Add Bookmark"}
                        </h2>

                        <input
                            type="text"
                            placeholder="URL"
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                            className="w-full p-3 mb-3 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Title (optional)"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full p-3 mb-3 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full p-3 mb-3 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            className="w-full p-3 mb-5 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 bg-black  rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal animation */}
            <style jsx>{`
        .animate-slide-in {
          transform: translateY(-20px);
          animation: slide-in 0.2s ease forwards;
        }
        @keyframes slide-in {
          to {
            transform: translateY(0);
          }
        }
      `}</style>
        </main>
    );
}
