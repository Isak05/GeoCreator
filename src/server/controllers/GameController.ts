/**
 * @file The home controller.
 * @module controllers/GameController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";
import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import GameModel from "../models/GameModel.js";

/**
 * Controller for accessing the home page
 */
export default class {
  async loadGame(
    req: Request,
    res: Response,
    next: Function,
    id: string
  ): Promise<void> {
    try {
      req.doc = await GameModel.findById(id).exec();

      if (!req.doc) {
        throw new Error();
      }

      logger.silly(`Game with id ${id} found`);
      next();
    } catch (error) {
      return next(createHttpError(404));
    }
  }

  async get(req: Request, res: Response, next: Function) {
    res.render("game/index");
  }

  async getAll(req: Request, res: Response, next: Function) {
    try {
      const games = await GameModel.find().exec();
      res.json(games.map((game) => req.originalUrl + "/" + game._id.toString()));
    } catch (error) {
      return next(createHttpError(500));
    }
  }

  async getData(req: Request, res: Response, next: Function) {
    try {
      res.json(req.doc.toObject());
    } catch (error) {
      return next(createHttpError(500));
    }
  }
}
