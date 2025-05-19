/**
 * Flash message middleware.
 * @module middlewares/flash
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle flash messages.
 *
 * If there are any flash messages in the session, they are moved to the response
 * locals and then deleted from the session.
 * @returns The middleware function.
 */
export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.flash) {
      res.locals.flash = req.session.flash;
      delete req.session.flash;
    }

    next();
  };
}
