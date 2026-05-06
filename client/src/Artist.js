import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Artist() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/artist/${id}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, [id]);

  return (
    <div style={container}>
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
            <p style={{ fontSize: 12 }}>אין preview זמין</p>
          )}
        </div>
      ))}
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