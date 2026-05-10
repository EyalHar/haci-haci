import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("haci_token");
    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setFavorites(data); setLoading(false); });
  }, []);

  async function removeFavorite(songId) {
    const token = localStorage.getItem("haci_token");
    await fetch(`http://localhost:5000/api/favorites/${songId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites((prev) => prev.filter((f) => f.songId !== songId));
  }

  return (
    <div style={container}>
      <h1 style={title}>❤️ המועדפים שלי</h1>

      {loading && <p style={{ color: "#888" }}>טוען...</p>}

      {!loading && favorites.length === 0 && (
        <p style={empty}>עוד לא הוספת מועדפים. לחץ על ❤️ ליד שיר כדי להוסיף!</p>
      )}

      <div style={grid}>
        {favorites.map((s) => (
          <div key={s.songId} style={card}>
            <img src={s.image} alt={s.title} width="200" style={{ borderRadius: 12 }} />
            <h3 style={{ margin: "10px 0 4px" }}>{s.title}</h3>
            <p style={{ color: "#666", margin: "0 0 10px", fontSize: 14 }}>{s.artist}</p>

            <a href={s.url} target="_blank" rel="noreferrer" style={spotifyLink}>
              ▶ פתח ב-Spotify
            </a>

            {s.preview && <audio controls src={s.preview} style={{ marginTop: 10, width: "100%" }} />}

            <button style={removeBtn} onClick={() => removeFavorite(s.songId)}>
              ❤️ הסר מהמועדפים
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  padding: 20,
  textAlign: "center",
  fontFamily: "Arial",
};

const title = {
  fontSize: 36,
  fontWeight: "900",
  marginBottom: 30,
  background: "linear-gradient(90deg, #e74c3c, #c0392b)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  justifyContent: "center",
};

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  width: 240,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const spotifyLink = {
  display: "inline-block",
  color: "#1DB954",
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: 14,
};

const removeBtn = {
  marginTop: 12,
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ffcccc",
  background: "#fff5f5",
  color: "#e74c3c",
  cursor: "pointer",
  fontSize: 13,
  width: "100%",
  transition: "background 0.2s",
};

const empty = {
  color: "#888",
  fontSize: 16,
  marginTop: 40,
};
