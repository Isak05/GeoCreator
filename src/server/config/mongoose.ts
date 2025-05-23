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
 * Provides a function for connecting to the MongoDB database.
 * @module config/mongoose
 */

import mongoose from "mongoose";
import { logger } from "./winston.js";
import process from "node:process";

/**
 * Connects to the MongoDB database using the provided connection string.
 *
 * This function sets up Mongoose configurations.
 * It also handles graceful shutdown on 'SIGINT' and 'SIGTERM' signals.
 * @param connectionString - The connection URI for the MongoDB database.
 * @returns - A promise that resolves when the connection is successfully established.
 */
export async function connectToDatabase(connectionString: string) {
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
