/**
 * The mongoose model for ratings.
 * @module models/RatingSchema
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import { User } from "./UserModel.js";

export interface Rating {
  user: User;
  rating: number;
}

const RatingSchema = new mongoose.Schema<Rating>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

export default RatingSchema;
