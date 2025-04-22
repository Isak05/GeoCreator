/**
 * Configures Helmet for security headers.
 *
 * @module config/helmet
 * @author Isak Johansson Weckstén <ij222pv.student.lnu.se>
 */

import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import type { IncomingMessage, ServerResponse } from "node:http";

export default function (): (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void
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
        resolve(mongoose.connection.getClient())
      ),
    }),
    cookie: {
      sameSite: "strict",
      secure: !(process.env.NODE_ENV === "development"),
      httpOnly: true,
    },
  });
}
