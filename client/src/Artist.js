import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Artist() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/artist/${id}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, [id]);
const card = {
  margin: "20px auto",
  padding: 20,
  maxWidth: 400,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: "#fff",
  textAlign: "center",
};
  const navigate = useNavigate();
  return (
    <div style={container}>
        <button onClick={() => navigate(-1)} style={backBtn}>
            ⬅ חזור
        </button>
      <h1>🎤 שירים מובילים</h1>

      {songs.map((s, i) => (
        <div key={i} style={card}>
          <img src={s.image} width="200" style={{ borderRadius: 12 }} />
          <h3>{s.title}</h3>
          <p>{s.artist}</p>

          <a href={s.url} target="_blank" rel="noreferrer">
            ▶ פתח ב-Spotify
          </a>

          {s.preview ? (
            <audio controls src={s.preview} />
          ) : (
            <p style={{ fontSize: 12 }}></p>
          )}
        </div>
      ))}

      <button onClick={() => navigate(-1)} style={backBtn}>
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
  marginBottom: 20,
  padding: 15,
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
};