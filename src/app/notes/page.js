"use client";

import { useEffect, useState } from "react";
import {
    getNotes,
    toggleNoteFavorite,
    createNote,
    updateNote,
    deleteNote,
} from "@/lib/api";
import { requireAuth } from "@/lib/requireAuth";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showtext, setshowtext] = useState(false)

    const [modalOpen, setModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState({
        title: "",
        content: "",
        tags: "",
    });

    const limit = 6;

    useEffect(() => requireAuth(), []);

    useEffect(() => {
        const timer = setTimeout(() => loadNotes(search, page), 300);
        return () => clearTimeout(timer);
    }, [search, page]);

    const loadNotes = async (q = "", pageNum = 1) => {
        setLoading(true);
        try {
            const res = await getNotes({ q, page: pageNum, limit });
            setNotes(res.data);
            setHasMore(res.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (id) => {
        await toggleNoteFavorite(id);
        loadNotes(search, page);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure to delete this note?")) return;
        await deleteNote(id);
        loadNotes(search, page);
    };

    const openModal = (note = null) => {
        if (note) setCurrentNote(note);
        else setCurrentNote({ title: "", content: "", tags: "" });
        setModalOpen(true);
    };
    const opentext = (note = null) => {
        if (note) setCurrentNote(note);
        else setCurrentNote({ title: "", content: "", tags: "" });
        setshowtext(true);
    };

    const handleSave = async () => {
        try {
            const tags =
                typeof currentNote.tags === "string"
                    ? currentNote.tags.split(",").map((t) => t.trim())
                    : currentNote.tags;
            if (currentNote._id) {
                // console.log(currentNote)
                await updateNote(currentNote._id, {
                    ...currentNote,
                    tags,
                });
            } else {
                // console.log(currentNote)
                await createNote({
                    ...currentNote,
                    tags,
                });
            }
            setModalOpen(false);
            loadNotes(search, page);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <main className="min-h-screen text-white bg-[#0a121f] p-6">
            <h1 className="text-3xl font-bold mb-6 font-sans">Notes 📝</h1>

            <div className="flex flex-col md:flex-row   justify-between mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="flex-1 p-3 pl-5 border bg-[#0f1a29] border-gray-800 rounded-3xl shadow-sm outline-none "
                />
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-[#0f1a29] cursor-pointer hover:border-[#00e5ff80] border font-mono  border-[#243042] text-[#00e5ff]  font-semibold rounded-lg shadow transition"
                >
                    + Add Note
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 mt-10">Loading...</p>
            ) : notes.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No notes found</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="bg-[#0f1a29]  p-5 rounded-2xl shadow-md hover:shadow-lg transition relative border border-[#243042] "
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="font-semibold text-xl font-mono text-white">
                                    {note.title || "Untitled"}
                                </h2>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleFavorite(note._id)}
                                        className="text-xl hover:text-yellow-500 transition"
                                    >
                                        {note.favorite ? "⭐" : "☆"}
                                    </button>
                                    <button
                                        onClick={() => openModal(note)}
                                        className="text-[#00e5ff] cursor-pointer font-semibold  transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="text-red-600 cursor-pointer font-semibold hover:text-red-800 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="text-[#94a3b8] mt-3 text-sm line-clamp-2">{note.content}

                            </p>
                                
                            {note.content.split("\n").length > 2 || note.content.length > 150 ? (
                                <button
                                    onClick={() => opentext(note)}
                                    className="text-[#00e5ff] mt-1 cursor-pointer text-sm font-medium"
                                >
                                    View More
                                </button>
                            ) : null}


                            {note.tags && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {note.tags.map((tag, idx) => (
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
            )}

            {/* Pagination */}
            {notes.length > 0 && (hasMore || page > 1) && (
            <div className="flex justify-center gap-4 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 cursor-pointer  border bg-[#0f1a29]  text-[#00e5ff] border-[#243042] rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Prev
                </button>
                <span className="px-4 py-2 font-semibold text-white">
                    Page {page}
                </span>
                <button
                    disabled={!hasMore}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 cursor-pointer rounded border bg-[#0f1a29]  border-[#243042] text-[#00e5ff] disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Next
                </button>
            </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 backdrop-blur-xs  flex justify-center items-center z-50">
                    <div className="bg-[#0f1a29]  p-6 rounded-2xl border border-[#243042] w-full max-w-md shadow-xl animate-slide-in">
                        <h2 className="text-2xl font-bold mb-5 text-[#00e5ff]">
                            {currentNote._id ? "Edit Note" : "Add Note"}
                        </h2>

                        <input
                            type="text"
                            placeholder="Title"
                            value={currentNote.title}
                            onChange={(e) =>
                                setCurrentNote({ ...currentNote, title: e.target.value })
                            }
                            className="w-full p-3 mb-3 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <textarea
                            placeholder="Content"
                            value={currentNote.content}
                            onChange={(e) =>
                                setCurrentNote({ ...currentNote, content: e.target.value })
                            }
                            className="w-full p-3 mb-3 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={currentNote.tags}
                            onChange={(e) =>
                                setCurrentNote({ ...currentNote, tags: e.target.value })
                            }
                            className="w-full p-3 mb-5 border border-[#243042]  bg-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-5 py-2 bg-black  rounded-lg cursor-pointer hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showtext && (
                <div onClick={()=>setshowtext(false)} className="fixed inset-0 backdrop-blur-xs  flex justify-center items-center z-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-[#0f1a29]  p-6 rounded-2xl border border-[#243042] w-full max-w-md shadow-xl animate-slide-in">
                            <div onClick={() => setshowtext(false)} className="text-gray-50 absolute top-3 right-3 font-bold cursor-pointer">✕</div>
                        
                            <p className="text-[#94a3b8] mt-3 text-sm ">{currentNote.content}

                            </p>
                        
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
