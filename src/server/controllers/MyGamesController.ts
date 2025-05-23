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
 * The my games controller.
 * @module controllers/MyGamesController
 */

import { NextFunction, Request, Response } from "express";
import GameModel from "../models/GameModel.js";
import createHttpError from "http-errors";

/**
 * Controller for accessing the my games page
 */
export default class {
  /**
   * Renders the my games page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   */
  async get(req: Request, res: Response, next: NextFunction) {
    if (!req.session.loggedInUser) {
      next(createHttpError(404));
      return;
    }

    const games = (
      await GameModel.find({
        creator: req.session.loggedInUser?.id,
      })
        .populate("creator")
        .exec()
    ).sort((game1, game2) => {
      return game2.averageRating - game1.averageRating;
    });
    res.render("my-games", {
      games,
    });
  }
}
