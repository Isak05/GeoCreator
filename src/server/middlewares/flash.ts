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
 * Flash message middleware.
 * @module middlewares/flash
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
