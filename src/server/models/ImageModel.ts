/**
 * The mongoose model for images.
 * @module models/ImageModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import type multer from "multer";

export interface Image {
  content: string;
  sha256: string;
}

interface ImageModel extends mongoose.Model<Image> {
  upload(
    file: string | { buffer: Buffer } | multer.File,
  ): Promise<mongoose.Document>;
}

export interface ImageMethods {
  getRaw(): Buffer;
}

/**
 * Generates a SHA-256 hash from a binarylike argument.
 * @param buffer - The binarylike argument to hash.
 * @returns The SHA-256 hash as a hexadecimal string.
 */
function getSha256Sum(buffer: string | Buffer): string {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

const schema = new mongoose.Schema<Image, ImageModel, ImageMethods>(
  {
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
      /**
       * Returns the raw image content as a buffer object.
       * @returns The raw image content as a buffer object.
       */
      getRaw(): Buffer {
        return Buffer.from(this.content, "base64");
      },
    },
    statics: {
      /**
       * Uploads an image file to the database. If an image with the same SHA-256 hash
       * already exists, it returns the existing image. Otherwise, it saves the new image
       * to the database.
       * @async
       * @param file - The file object to be uploaded.
       * @param file.buffer - The buffer containing the file's binary data.
       * @returns The uploaded image document or the existing image document if it already exists.
       */
      async upload(
        file: string | { buffer: Buffer } | multer.File,
      ): Promise<mongoose.Document> {
        // Get the base64 string from the file
        let base64 = null;
        if (typeof file === "string") {
          base64 = file;
        } else if (file && file.buffer) {
          base64 = file.buffer.toString("base64");
        } else {
          throw new Error("Invalid file object");
        }

        // Calculate the SHA-256 hash of the base64 string
        // and check if an image with the same hash already exists
        const sha256 = getSha256Sum(base64);
        const existingImage = await this.findOne({ sha256 });

        // If an image with the same hash already exists, return it
        if (existingImage) {
          return existingImage;
        }

        // Otherwise, create a new image document
        const image = new this();
        image.content = base64;
        image.sha256 = sha256;

        await image.save();
        return image;
      },
    },
  },
);

schema.add(BASE_SCHEMA);

const ImageModel = mongoose.model<Image, ImageModel>("Image", schema);
export default ImageModel;
