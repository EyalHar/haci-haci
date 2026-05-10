const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const User = require("./models/User");
const Favorite = require("./models/Favorite");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/haci-haci")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "haci-haci-secret";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId });
    const isNew = !user;
    if (isNew) {
      user = await User.create({ googleId, email, name, picture });
    }

    const token = jwt.sign({ googleId, email, name, picture }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user, isNew });
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// ── Favorites ─────────────────────────────────────────────────────────────────

app.get("/api/favorites", authMiddleware, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.googleId }).sort({ addedAt: -1 });
  res.json(favorites);
});

app.post("/api/favorites", authMiddleware, async (req, res) => {
  const { songId, title, artist, image, url, preview } = req.body;
  try {
    const fav = await Favorite.create({
      userId: req.user.googleId,
      songId, title, artist, image, url, preview,
    });
    res.json(fav);
  } catch (err) {
    if (err.code === 11000) return res.json({ already: true });
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/favorites/:songId", authMiddleware, async (req, res) => {
  await Favorite.deleteOne({ userId: req.user.googleId, songId: req.params.songId });
  res.json({ ok: true });
});

// ── Spotify ───────────────────────────────────────────────────────────────────

console.log("CLIENT ID:", process.env.SPOTIFY_CLIENT_ID ? "OK" : "MISSING");
console.log("CLIENT SECRET:", process.env.SPOTIFY_CLIENT_SECRET ? "OK" : "MISSING");

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
              process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
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

app.get("/api/artists", async (req, res) => {
  try {
    const letter = req.query.letter || "A";
    const token = await getToken();
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: `${letter}*`, type: "artist", limit: 10 },
      headers: { Authorization: "Bearer " + token },
    });
    const artists = response.data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url,
    }));
    res.json(artists);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

app.get("/api/artist/:id/songs", async (req, res) => {
  try {
    const token = await getToken();
    const artistRes = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const artistName = artistRes.data.name;
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: artistName, type: "track", limit: 10 },
      headers: { Authorization: "Bearer " + token },
    });
    const songs = response.data.tracks.items.map((item) => ({
      songId: item.id,
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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
