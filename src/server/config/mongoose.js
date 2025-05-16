/**
 * Provides a function for connecting to the MongoDB database.
 *
 * @module config/mongoose
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import { logger } from "./winston.js";
import process from "node:process";

/**
 * Connects to the MongoDB database using the provided connection string.
 *
 * This function sets up Mongoose configurations.
 * It also handles graceful shutdown on 'SIGINT' and 'SIGTERM' signals.
 *
 * @param {string} connectionString - The connection URI for the MongoDB database.
 * @returns {Promise} - A promise that resolves when the connection is successfully established.
 */
export async function connectToDatabase(connectionString) {
  mongoose.set("strict", "throw");
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () =>
    logger.info("Connected to MongoDB"),
  );
  mongoose.connection.on("disconnected", () =>
    logger.info("Disconnected from MongoDB"),
  );
  mongoose.connection.on("error", (error) => logger.error(error));

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  }

  logger.silly("Connecting to MongoDB...");
  return mongoose.connect(connectionString);
}
