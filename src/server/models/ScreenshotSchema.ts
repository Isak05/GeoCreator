/**
 * The mongoose model for screenshots.
 *
 * @module models/ScreenshotModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";

interface Vec2 {
  x: number;
  y: number;
}

export interface Screenshot {
  id: string;
  _id: mongoose.Types.ObjectId;
  url: string;
  correctAnswer: Vec2;
}

const Vec2Schema = new mongoose.Schema<Vec2>({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const ScreenshotSchema = new mongoose.Schema<Screenshot>({
  url: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: Vec2Schema,
    required: true,
  },
});

export default ScreenshotSchema;
