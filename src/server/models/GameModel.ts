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
}, {
  _id: false,
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
}, {
  _id: false,
});

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mapUrl: {
    type: String,
    required: true,
  },
  screenshots: {
    type: [screenshotSchema],
    required: true,
  },
}, {
  _id: false,
  id: false,
});

schema.add(BASE_SCHEMA);

const GameModel = mongoose.model("Game", schema);
export default GameModel;
