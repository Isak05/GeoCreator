/**
 * The mongoose base schema.
 * @module models/baseSchema
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
