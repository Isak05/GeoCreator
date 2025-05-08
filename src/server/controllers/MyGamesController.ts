/**
 * @file The my games controller.
 * @module controllers/MyGamesController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";
import GameModel from "../models/GameModel.js";
import createHttpError from "http-errors";

/**
 * Controller for accessing the my games page
 */
export default class {
  async get(req: Request, res: Response, next: Function) {
    if (!req.session.loggedInUser) {
      return next(createHttpError(404));
    }

    const games = await GameModel.find({ creator: req.session.loggedInUser?.id }).exec();
    res.render("my-games", {
      games,
    });
  }
}
