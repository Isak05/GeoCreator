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
 * The home controller.
 * @module controllers/HomeController
 */

import { Request, Response } from "express";
import GameModel from "../models/GameModel.js";

/**
 * Controller for accessing the home page
 */
export default class HomeController {
  /**
   * Renders the home page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async get(req: Request, res: Response) {
    const games = (await GameModel.find({}).populate("creator").exec()).sort(
      (game1, game2) => {
        return game2.averageRating - game1.averageRating;
      },
    );
    res.render("home/index", { games });
  }
}
