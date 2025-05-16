/**
 * Error handling middleware.
 * @module middlewares/errorHandler
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { getReasonPhrase } from "http-status-codes";
import process from "node:process";

/**
 * Error handling middleware for Express.js applications.
 * @returns The error handling middleware function.
 */
export default function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, req, res, next) => {
    const status = err.status ?? 500;

    res.locals.title = `${status} ${getReasonPhrase(status)}`;

    if (process.env.NODE_ENV === "development") {
      res.locals.message = err;
    }

    res.status(status).render("errors/error");
  };
}
