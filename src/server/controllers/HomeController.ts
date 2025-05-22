/**
 * @file The home controller.
 * @module controllers/HomeController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
