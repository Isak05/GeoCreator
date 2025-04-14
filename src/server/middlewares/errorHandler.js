/**
 * Error handling middleware.
 *
 * @module middlewares/errorHandler
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { getReasonPhrase } from "http-status-codes";

/**
 * Error handling middleware for Express.js applications.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export default function () {
  return (err, req, res, next) => {
    const status = err.status ?? 500;
    res.locals.title = `${status} ${getReasonPhrase(status)}`;

    if (process.env.NODE_ENV === "development") {
      res.locals.message = err;
    }

    res.status(status).render("errors/error");
  };
}
