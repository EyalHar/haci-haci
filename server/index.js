const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

// בדיקת משתני סביבה (חשוב לדיבוג)
console.log("CLIENT ID:", process.env.SPOTIFY_CLIENT_ID ? "OK" : "MISSING");
console.log("CLIENT SECRET:", process.env.SPOTIFY_CLIENT_SECRET ? "OK" : "MISSING");

// קבלת טוקן מ-Spotify (Client Credentials Flow)
async function getToken() {
  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );

    return res.data.access_token;
  } catch (err) {
    console.log("TOKEN ERROR:", err.response?.data || err.message);
    throw err;
  }
}

// API לשירים
app.get("/api/songs", async (req, res) => {
  try {
    const token = await getToken();

    // endpoint יותר יציב ללמידה (פותר הרבה 403)
    const response = await axios.get(
      "https://api.spotify.com/v1/search?q=top&type=track&limit=10",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const songs = response.data.tracks.items.map((item) => ({
      title: item.name,
      artist: item.artists[0].name,
      image: item.album.images[0]?.url,
    }));

    res.json(songs);
  } catch (err) {
    console.log("API ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});