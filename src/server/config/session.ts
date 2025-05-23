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
 * Configures the session middleware for the application.
 * This middleware uses MongoDB as the session store and sets various options for the session.
 * @module config/session
 */

import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Configures the session middleware for the application.
 * @returns A middleware function that sets up the session.
 */
export default function (): (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) => void {
  if (!process.env.SESSION_NAME || !process.env.SESSION_SECRET) {
    throw new Error("SESSION_NAME and SESSION_SECRET be set in .env");
  }

  return session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: new Promise((resolve) =>
        resolve(mongoose.connection.getClient()),
      ),
    }),
    cookie: {
      sameSite: "strict",
      secure: !(process.env.NODE_ENV === "development"),
      httpOnly: true,
    },
  });
}
