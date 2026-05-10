import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Artist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const token = localStorage.getItem("haci_token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/artist/${id}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data));

    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFavorites(new Set(data.map((f) => f.songId))));
  }, [id]);

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
      <button
        onClick={() => navigate(-1)}
        style={hoveredBtn === "top" ? { ...backBtn, ...backBtnHover } : backBtn}
        onMouseEnter={() => setHoveredBtn("top")}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        ⬅ חזור
      </button>

      <h1>🎤 שירים מובילים</h1>

      {songs.map((s, i) => (
        <div key={i} style={card}>
          <img src={s.image} width="200" style={{ borderRadius: 12 }} alt={s.title} />
          <h3>{s.title}</h3>
          <p>{s.artist}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
            <a href={s.url} target="_blank" rel="noreferrer">▶ פתח ב-Spotify</a>
            <button
              style={favorites.has(s.songId) ? { ...heartBtn, ...heartBtnActive } : heartBtn}
              onClick={() => toggleFavorite(s)}
              title={favorites.has(s.songId) ? "הסר ממועדפים" : "הוסף למועדפים"}
            >
              {favorites.has(s.songId) ? "❤️" : "🤍"}
            </button>
          </div>

          {s.preview ? (
            <audio controls src={s.preview} />
          ) : (
            <p style={{ fontSize: 12 }}></p>
          )}
        </div>
      ))}

      <button
        onClick={() => navigate(-1)}
        style={hoveredBtn === "bottom" ? { ...backBtn, ...backBtnHover } : backBtn}
        onMouseEnter={() => setHoveredBtn("bottom")}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        ⬅ חזור
      </button>
    </div>
  );
}

const container = {
  padding: 20,
  textAlign: "center",
  fontFamily: "Arial",
};

const card = {
  margin: "20px auto",
  padding: 20,
  maxWidth: 400,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: "#fff",
  textAlign: "center",
};

const backBtn = {
  margin: 10,
  padding: "10px 15px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#1DB954",
  color: "white",
  fontWeight: "bold",
  transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
};

const backBtnHover = {
  background: "#17a347",
  transform: "scale(1.07)",
  boxShadow: "0 4px 12px rgba(29,185,84,0.4)",
};

const heartBtn = {
  background: "none",
  border: "none",
  fontSize: 22,
  cursor: "pointer",
  transition: "transform 0.15s",
  padding: 4,
};

const heartBtnActive = {
  transform: "scale(1.2)",
};
