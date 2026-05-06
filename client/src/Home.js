import { useState } from "react";
import { useNavigate } from "react-router-dom";

const english = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const hebrew = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];

export default function Home() {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  const fetchArtists = (letter) => {
    fetch(`http://localhost:5000/api/artists?letter=${letter}`)
      .then((res) => res.json())
      .then((data) => setArtists(data));
  };

  return (
    <div style={container}>
      <h1>🎵 הכי הכי - בחר אמן</h1>

      <h3>English</h3>
      <div style={letters}>
        {english.map((l) => (
          <button key={l} onClick={() => fetchArtists(l)}>
            {l}
          </button>
        ))}
      </div>

      <h3>עברית</h3>
      <div style={letters}>
        {hebrew.map((l) => (
          <button key={l} onClick={() => fetchArtists(l)}>
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
};

const img = {
  width: 150,
  height: 150,
  objectFit: "cover",
  borderRadius: 10,
};