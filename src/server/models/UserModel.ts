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
 * The mongoose model for users.
 * @module models/UserModel
 */

import mongoose, { HydratedDocument } from "mongoose";
import * as argon2 from "argon2";
import BASE_SCHEMA from "./baseSchema.js";
import { NextFunction } from "express";

export interface User {
  username: string;
  password: string;
  _id: string;
  id: string;
}

interface UserModel extends mongoose.Model<User> {
  authenticate(username: string, password: string): Promise<User | null>;
  isUsernameTaken(username: string): Promise<boolean>;
}

const convertObject = Object.freeze({
  getters: true,
  versionKey: false,
  /**
   * Transforms the returned object by removing the password and _id fields.
   * @param doc - The document being transformed.
   * @param ret - The plain object representation of the document.
   * @returns The transformed object without the password and _id fields.
   */
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

export const UserSchema = new mongoose.Schema<User, UserModel>(
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
       * @param username - The username of the user.
       * @param password - The password of the user.
       * @returns Returns a promise that resolves to the user document if the credentials are correct, otherwise null.
       */
      async authenticate(
        username: string,
        password: string,
      ): Promise<User | null> {
        const user = await this.findOne({ username });

        if (!user || !(await argon2.verify(user.password, password))) {
          return null;
        }

        return user;
      },

      /**
       * Checks if a username is already taken in the database.
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

UserSchema.add(BASE_SCHEMA);

UserSchema.pre("save", async function (next: NextFunction) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await argon2.hash(this.password);
  next();
});

const UserModel = mongoose.model<User, UserModel>("User", UserSchema);
export default UserModel;
