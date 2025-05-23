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
 * Defines the Winston logger.
 * @module config/winston
 * @author Mats Loock
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

// import '@lnu/json-js-cycle'
import winston, { addColors, createLogger, format, transports } from "winston";

// Destructuring assignment for convenience.
const { colorize, combine, printf, timestamp } = format;

// The colorizer.
const colorizer = colorize();

// Adds colors to the colorizer.
addColors({
  info: "blue",
  warn: "italic yellow",
  error: "bold red",
  http: "white",
  debug: "magenta",
  silly: "cyan",
  verbose: "gray",
});

// Finds ANSI color sequences.
// eslint-disable-next-line no-control-regex
const decolorizeRegex = /\x1b\[[0-9]{1,3}m/gi;

/**
 * Removes ANSI color sequences from the message.
 */
const decolorize = format((info: winston.Logform.TransformableInfo) => {
  if (!info[Symbol.for("message")]) {
    return info;
  }

  info[Symbol.for("message")] = (info[Symbol.for("message")] as string).replace(
    decolorizeRegex,
    "",
  );
  return info;
});

/**
 * The base format.
 */
const baseFormat = combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }));

/**
 * The logger.
 */
export const logger: winston.Logger = createLogger({
  level: process.env.LOG_LEVEL || "http",
  format: combine(
    baseFormat,
    printf(
      ({
        timestamp,
        level,
        message,
        stack,
      }: {
        timestamp: string;
        level: string;
        message: string;
        stack?: string;
      }) => {
        let colorLevel: string = level;

        // If the level is http, let the status code decide the color.
        if (level === "http") {
          const status: number = Number.parseInt(message.split(" ")[5]);

          if (status >= 500) {
            colorLevel = "error";
          } else if (status >= 400) {
            colorLevel = "warn";
          } else if (status >= 300) {
            colorLevel = "verbose";
          } else if (status >= 200) {
            colorLevel = "http";
          }
        }

        return colorizer.colorize(
          colorLevel,
          `[${timestamp}] ${level.toLocaleUpperCase()}: ${message} ${stack ? `\n  ${stack}` : ""}`,
        );
      },
    ),
  ),
  transports: [new transports.Console()],
});

// Add file transport if a path to the combined log file is provided.
if (process.env.LOGGER_COMBINED_LOG_FILE) {
  logger.add(
    new transports.File({
      filename: process.env.LOGGER_COMBINED_LOG_FILE,
      format: combine(baseFormat, decolorize()),
    }),
  );
}

// Add file transport if a path to the error log file is provided.
if (process.env.LOGGER_ERROR_LOG_FILE) {
  logger.add(
    new transports.File({
      filename: process.env.LOGGER_ERROR_LOG_FILE,
      level: "error",
      format: combine(baseFormat, decolorize()),
    }),
  );
}
