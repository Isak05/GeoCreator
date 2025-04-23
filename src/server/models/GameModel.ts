/**
 * The mongoose model for images.
 *
 * @module models/GameModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";

const schema = new mongoose.Schema({
  mapUrl: {
    type: String,
    required: true,
  },
  screenshotUrls: {
    type: [String],
    required: true,
  },
});

schema.add(BASE_SCHEMA);

const gameModel = mongoose.model("Game", schema);
export default gameModel;
