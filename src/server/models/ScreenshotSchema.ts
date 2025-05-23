/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

/**
 * The mongoose model for screenshots.
 * @module models/ScreenshotModel
 */

import mongoose from "mongoose";

interface Vec2 {
  x: number;
  y: number;
}

export interface Screenshot {
  _id: mongoose.Types.ObjectId;
  id: string;
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

const screenshotSchema = new mongoose.Schema<Screenshot>({
  url: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: Vec2Schema,
    required: true,
  },
});

export default screenshotSchema;
