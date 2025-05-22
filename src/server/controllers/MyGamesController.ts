/**
 * @file The my games controller.
 * @module controllers/MyGamesController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
