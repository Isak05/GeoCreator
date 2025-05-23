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
 * The mongoose base schema.
 * @module models/baseSchema
 */

import mongoose from "mongoose";

const convertObject = Object.freeze({
  getters: true,
  versionKey: false,
  /**
   * Remove the _id field from the document.
   * @param doc - The mongoose document which is being converted
   * @param ret - The plain object representation which has been converted
   * @returns - The transformed object
   */
  transform: (doc: mongoose.Document, ret: mongoose.Document) => {
    delete ret._id;
    return ret;
  },
});

const baseSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
    toObject: convertObject,
    toJSON: convertObject,
    optimisticConcurrency: true,
  },
);

const BASE_SCHEMA = Object.freeze(baseSchema);
export default BASE_SCHEMA;
