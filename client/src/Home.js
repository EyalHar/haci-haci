import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const english = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const hebrew = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];

export default function Home() {
  const [artists, setArtists] = useState([]);
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchArtists = (letter) => {
    fetch(`http://localhost:5000/api/artists?letter=${letter}`)
      .then((res) => res.json())
      .then((data) => setArtists(data));
  };

  return (
    <div style={container}>
      <div style={header}>
        <span style={userInfo}>👤 {user?.name}</span>
        <button onClick={() => { logout(); navigate("/login"); }} style={logoutBtn}>
          יציאה
        </button>
      </div>
      <h1 style={title}>הכי הכי 🎵</h1>

      <div style={letters}>
        {english.map((l) => (
          <button
            key={l}
            onClick={() => fetchArtists(l)}
            style={hoveredLetter === l ? { ...letterBtn, ...letterBtnHover } : letterBtn}
            onMouseEnter={() => setHoveredLetter(l)}
            onMouseLeave={() => setHoveredLetter(null)}
            >
            {l}
            </button>
        ))}
      </div>

      <div style={letters}>
        {hebrew.map((l) => (
          <button
            key={l}
            onClick={() => fetchArtists(l)}
            style={hoveredLetter === l ? { ...letterBtn, ...letterBtnHover } : letterBtn}
            onMouseEnter={() => setHoveredLetter(l)}
            onMouseLeave={() => setHoveredLetter(null)}
            >
            {l}
            </button>
        ))}
      </div>

      <div style={grid}>
        {artists.map((a) => (
          <div
            key={a.id}
            style={card}
            onClick={() => navigate(`/artist/${a.id}`)}
          >
            <img src={a.image} style={img} />
            <p>{a.name}</p>
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

const letters = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  justifyContent: "center",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 150px)",
  gap: 20,
  justifyContent: "center",
};

const card = {
  cursor: "pointer",
  transition: "0.2s",
};
const img = {
  width: 150,
  height: 150,
  objectFit: "cover",
  borderRadius: 10,
};

const title = {
  fontSize: 48,
  fontWeight: "900",
  marginBottom: 30,
  letterSpacing: "2px",
  background: "linear-gradient(90deg, #1DB954, #191414)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const letterBtn = {
  padding: "10px 14px",
  margin: 4,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#1DB954",
  color: "white",
  fontWeight: "bold",
  transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
};

const letterBtnHover = {
  background: "#17a347",
  transform: "scale(1.15)",
  boxShadow: "0 4px 12px rgba(29,185,84,0.4)",
};

const header = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 12,
  marginBottom: 10,
};

const userInfo = {
  fontSize: 14,
  color: "#555",
};

const logoutBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  cursor: "pointer",
  background: "#fff",
  color: "#333",
  fontSize: 13,
  transition: "background 0.2s",
};
