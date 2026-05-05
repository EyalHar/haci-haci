import { useEffect, useState } from "react";

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 haci-haci - שירים חמים</h1>

      {songs.map((song, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <img src={song.image} width="150" />
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      ))}
    </div>
  );
}

export default App;