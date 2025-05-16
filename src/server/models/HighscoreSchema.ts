/**
 * The mongoose model for highscores.
 * @module models/HighscoreModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import UserModel from "./UserModel.js";

export interface Highscore {
  user: mongoose.Types.ObjectId;
  score: number;
  time: number;
}

const HighscoreSchema = new mongoose.Schema<Highscore>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

export default HighscoreSchema;
