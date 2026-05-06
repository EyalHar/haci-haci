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
//"https://api.spotify.com/v1/search?q=Queen&type=track&limit=10"
//"https://api.spotify.com/v1/search?q=Rock israeli&type=track&limit=10",
//"https://api.spotify.com/v1/search?q=pop israeli&type=track&limit=10",
    // endpoint יותר יציב ללמידה (פותר הרבה 403)
    const response = await axios.get(
      "https://api.spotify.com/v1/search?q=pop israeli&type=track&limit=10",
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
  url: item.external_urls.spotify,
  preview: item.preview_url, // יכול להיות null
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

app.get("/api/artists", async (req, res) => {
  try {
    const letter = req.query.letter || "A";

    const token = await getToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: `${letter}*`,
          type: "artist",
          limit: 10
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const artists = response.data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url,
    }));

    res.json(artists);
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});
/*app.get("/api/artist/:id/songs", async (req, res) => {
  try {
    const token = await getToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}/top-tracks`,
      {
        params: {
          market: "IL"
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const songs = response.data.tracks.map((item) => ({
      title: item.name,
      artist: item.artists[0].name,
      image: item.album.images[0]?.url,
      url: item.external_urls.spotify,
      preview: item.preview_url,
    }));

    res.json(songs);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});*/

app.get("/api/artist/:id/songs", async (req, res) => {
  try {
    const token = await getToken();

    // קודם מביאים את שם האמן
    const artistRes = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const artistName = artistRes.data.name;

    // עכשיו מחפשים שירים לפי שם האמן (זה מה שעבד לך קודם!)
    const response = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        params: {
          q: artistName,
          type: "track",
          limit: 10,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const songs = response.data.tracks.items.map((item) => ({
      title: item.name,
      artist: item.artists[0].name,
      image: item.album.images[0]?.url,
      url: item.external_urls.spotify,
      preview: item.preview_url,
    }));

    res.json(songs);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});