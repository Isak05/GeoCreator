/**
 * Error handling middleware.
 * @module middlewares/errorHandler
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
