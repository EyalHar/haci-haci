import { useState } from "react";

export default function SongSearch() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [searched, setSearched] = useState(false);

  const token = localStorage.getItem("haci_token");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const [songsRes, favsRes] = await Promise.all([
      fetch(`http://localhost:5000/api/songs/search?q=${encodeURIComponent(query.trim())}`).then((r) => r.json()),
      fetch("http://localhost:5000/api/favorites", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ]);

    setSongs(Array.isArray(songsRes) ? songsRes : []);
    setFavorites(new Set(Array.isArray(favsRes) ? favsRes.map((f) => f.songId) : []));
    setLoading(false);
  }

  async function toggleFavorite(song) {
    const isFav = favorites.has(song.songId);
    if (isFav) {
      await fetch(`http://localhost:5000/api/favorites/${song.songId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => { const s = new Set(prev); s.delete(song.songId); return s; });
    } else {
      await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(song),
      });
      setFavorites((prev) => new Set([...prev, song.songId]));
    }
  }

  return (
    <div style={container}>
      <h1 style={title}>🔍 חיפוש שירים</h1>

      <form onSubmit={handleSearch} style={searchForm}>
        <input
          style={searchInput}
          type="text"
          placeholder="חפש שיר לפי שם..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button type="submit" style={searchBtn}>חפש</button>
      </form>

      {loading && <p style={info}>מחפש...</p>}

      {!loading && searched && songs.length === 0 && (
        <p style={info}>לא נמצאו תוצאות עבור "{query}"</p>
      )}

      <div style={grid}>
        {songs.map((s) => (
          <div key={s.songId} style={card}>
            <img src={s.image} alt={s.title} style={img} />
            <div style={cardBody}>
              <p style={songTitle}>{s.title}</p>
              <p style={artistName}>{s.artist}</p>
              <div style={actions}>
                <a href={s.url} target="_blank" rel="noreferrer" style={spotifyLink}>
                  ▶ Spotify
                </a>
                <button
                  style={favorites.has(s.songId) ? { ...heartBtn, ...heartActive } : heartBtn}
                  onClick={() => toggleFavorite(s)}
                  title={favorites.has(s.songId) ? "הסר ממועדפים" : "הוסף למועדפים"}
                >
                  {favorites.has(s.songId) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  padding: 24,
  fontFamily: "Arial",
  textAlign: "center",
};

const title = {
  fontSize: 36,
  fontWeight: "900",
  marginBottom: 24,
  background: "linear-gradient(90deg, #1DB954, #191414)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const searchForm = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  marginBottom: 30,
};

const searchInput = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "2px solid #1DB954",
  fontSize: 15,
  width: 280,
  outline: "none",
  fontFamily: "Arial",
  direction: "rtl",
};

const searchBtn = {
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  background: "#1DB954",
  color: "white",
  fontWeight: "bold",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "Arial",
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  justifyContent: "center",
};

const card = {
  background: "#fff",
  borderRadius: 12,
  width: 200,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  overflow: "hidden",
  textAlign: "right",
};

const img = {
  width: "100%",
  height: 200,
  objectFit: "cover",
};

const cardBody = {
  padding: "10px 12px",
};

const songTitle = {
  fontWeight: "bold",
  fontSize: 13,
  margin: "0 0 4px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const artistName = {
  fontSize: 12,
  color: "#777",
  margin: "0 0 8px",
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const spotifyLink = {
  fontSize: 12,
  color: "#1DB954",
  fontWeight: "bold",
  textDecoration: "none",
};

const heartBtn = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  padding: 2,
  transition: "transform 0.15s",
};

const heartActive = {
  transform: "scale(1.2)",
};

const info = {
  color: "#888",
  marginTop: 20,
};
