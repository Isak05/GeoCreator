/**
 * The mongoose model for images.
 *
 * @module models/GameModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";

const vec2Schema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const screenshotSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: vec2Schema,
    required: true,
  },
});

const schema = new mongoose.Schema({
  mapUrl: {
    type: String,
    required: true,
  },
  screenshots: {
    type: [screenshotSchema],
    required: true,
  },
});

schema.add(BASE_SCHEMA);

const GameModel = mongoose.model("Game", schema);
export default GameModel;
