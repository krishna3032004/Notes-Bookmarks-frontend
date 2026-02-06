const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  console.log(token)

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}


export async function getNotes(params = {}) {
  const query = new URLSearchParams(params).toString();
//   console.log(query)

  const res = await fetch(
    `${BASE_URL}/notes${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }

  return res.json();
}


export async function toggleNoteFavorite(id) {
  const res = await fetch(
    `${BASE_URL}/notes/${id}/favorite`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to toggle favorite");
  }

  return res.json();
}


export async function getBookmarks(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${BASE_URL}/bookmarks${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  return res.json();
}

export async function toggleBookmarkFavorite(id) {
  const res = await fetch(
    `${BASE_URL}/bookmarks/${id}/favorite`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to toggle favorite");
  }

  return res.json();
}




// CREATE NOTE
export async function createNote(note) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });

  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

// UPDATE NOTE
export async function updateNote(id, note) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });

  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

// DELETE NOTE
export async function deleteNote(id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}




// CREATE BOOKMARK
export async function createBookmark(bookmark) {
  const res = await fetch(`${BASE_URL}/bookmarks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookmark),
  });

  if (!res.ok) throw new Error("Failed to create bookmark");
  return res.json();
}

// UPDATE BOOKMARK
export async function updateBookmark(id, bookmark) {
  const res = await fetch(`${BASE_URL}/bookmarks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookmark),
  });

  if (!res.ok) throw new Error("Failed to update bookmark");
  return res.json();
}

// DELETE BOOKMARK
export async function deleteBookmark(id) {
  const res = await fetch(`${BASE_URL}/bookmarks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete bookmark");
  return res.json();
}



export async function fetchMetadata(url) {
  const res = await fetch(`${BASE_URL}/fetch-metadata`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") && { Authorization: `Bearer ${localStorage.getItem("token")}` }) },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("Failed to fetch metadata");
  return res.json(); // { title, description }
}
