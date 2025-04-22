/**
 * The mongoose model for images.
 *
 * @module models/ImageModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import { get } from "http";

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
  },
},
{
  methods: {
    getRaw() {
      return Buffer.from(this.content, "base64");
    }
  }
});

schema.add(BASE_SCHEMA);

const model = mongoose.model("Image", schema);
export default model;
