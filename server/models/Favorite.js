const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  songId:  { type: String, required: true },
  title:   { type: String, required: true },
  artist:  { type: String },
  image:   { type: String },
  url:     { type: String },
  preview: { type: String },
  addedAt: { type: Date, default: Date.now },
});

favoriteSchema.index({ userId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
