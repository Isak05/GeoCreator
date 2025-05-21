/**
 * The mongoose model for highscores.
 * @module models/HighscoreModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import { User } from "./UserModel.js";

export interface Highscore {
  user: User;
  score: number;
  time: number;
}

const HighscoreSchema = new mongoose.Schema<Highscore>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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
