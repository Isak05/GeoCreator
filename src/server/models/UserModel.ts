/**
 * The mongoose model for users.
 *
 * @module models/UserModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose, { HydratedDocument } from "mongoose";
import * as argon2 from "argon2";
import BASE_SCHEMA from "./baseSchema.js";
import { NextFunction } from "express";

const convertObject = Object.freeze({
  getters: true,
  versionKey: false,
  transform: (
    doc: HydratedDocument<{ password: string; _id: string }>,
    ret: HydratedDocument<{ password: string; _id: string }>,
  ) => {
    // Remove the password and _id fields from the returned object
    delete ret.password;
    delete ret._id;
    return ret;
  },
});

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    statics: {
      /**
       * Tries to log in a user.
       *
       * @param username - The username of the user.
       * @param password - The password of the user.
       * @returns Returns a promise that resolves to the user document if the credentials are correct, otherwise null.
       */
      async authenticate(username: string, password: string) {
        const user = await this.findOne({ username });

        if (!user || !(await argon2.verify(user.password, password))) {
          return null;
        }

        return user;
      },

      /**
       * Checks if a username is already taken in the database.
       *
       * @param username - The username to check for existence.
       * @returns A promise that resolves to `true` if the username exists, otherwise `false`.
       */
      async isUsernameTaken(username: string): Promise<boolean> {
        return (await this.exists({ username })) !== null;
      },
    },
    toObject: convertObject,
    toJSON: convertObject,
  },
);

schema.add(BASE_SCHEMA);

schema.pre("save", async function (next: NextFunction) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await argon2.hash(this.password);
  next();
});

const UserModel = mongoose.model("User", schema);
export default UserModel;
