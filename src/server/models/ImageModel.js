/**
 * The mongoose model for images.
 *
 * @module models/ImageModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import crypto from "node:crypto";

function sha256HashFromBuffer(buffer) {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sha256: {
    type: String,
    required: true,
  },
},
{
  methods: {
    getRaw() {
      return Buffer.from(this.content, "base64");
    }
  },
  statics: {
    /**
     * Uploads an image file to the database. If an image with the same SHA-256 hash
     * already exists, it returns the existing image. Otherwise, it saves the new image
     * to the database.
     *
     * @async
     * @param {Object} file - The file object to be uploaded.
     * @param {Buffer} file.buffer - The buffer containing the file's binary data.
     * @returns {Promise<Object>} The uploaded image document or the existing image document if it already exists.
     */
    async upload(file) {
      const sha256 = sha256HashFromBuffer(file.buffer);
      const existingImage = await this.findOne({ sha256 });
      
      if (existingImage) {
        return existingImage;
      }

      const image = new this();
      image.content = file.buffer.toString("base64");
      image.sha256 = sha256;

      await image.save();
      return image;
    }
  }
});

schema.add(BASE_SCHEMA);

const ImageModel = mongoose.model("Image", schema);
export default ImageModel;
