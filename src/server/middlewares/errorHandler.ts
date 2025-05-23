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
 * Error handling middleware.
 * @module middlewares/errorHandler
 */

import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { getReasonPhrase } from "http-status-codes";
import process from "node:process";

/**
 * Error handling middleware for Express.js applications.
 * @returns The error handling middleware function.
 */
export default function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: object, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
      // If the error is an instance of HttpError, set the status code and message.
      const status = err.status ?? 500;

      res.locals.title = `${status} ${getReasonPhrase(status)}`;

      if (process.env.NODE_ENV === "development") {
        res.locals.message = err;
      }

      res.status(status);
    }

    res.render("errors/error");
  };
}
