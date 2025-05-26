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
 * The game controller.
 * @module controllers/GameController
 */

import { NextFunction, Request, Response } from "express";
import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import GameModel from "../models/GameModel.js";
import ImageModel from "../models/ImageModel.js";
import { Screenshot } from "../models/ScreenshotSchema.js";
import getUrl from "../utils/getUrl.js";

/**
 * Controller for accessing and modifying games.
 */
export default class {
  /**
   * Middleware to load a game document by its ID and attach it to the request object.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function in the stack.
   * @param id - The ID of the game to load.
   * @throws Will call the next middleware with a 404 HTTP error if the game is not found.
   */
  async loadGame(
    req: Request,
    res: Response,
    next: NextFunction,
    id: string,
  ): Promise<void> {
    try {
      req.game = await GameModel.findById(id)
        .populate(["creator", "highscoreList.user"])
        .exec();

      if (!req.game) {
        throw new Error();
      }

      logger.silly(`Game with id ${id} found`);
      next();
    } catch {
      res.status(404).json({
        message: "Game not found",
      });
      return;
    }
  }

  /**
   * Loads a screenshot by its ID and attaches it to the request object.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   * @param id - The ID of the screenshot to load.
   */
  async loadScreenshot(
    req: Request,
    res: Response,
    next: NextFunction,
    id: string,
  ): Promise<void> {
    try {
      req.screenshot = req.game.screenshots.find((screenshot: Screenshot) => {
        return screenshot.id === id;
      });

      if (!req.screenshot) {
        throw new Error();
      }
    } catch {
      res.status(404).json({
        message: "Screenshot not found",
      });
      return;
    }

    next();
  }

  /**
   * Handles the GET request to render the game index page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A rendered view of the "game/index" page.
   */
  async get(req: Request, res: Response) {
    const game = req.game;
    const playable = req.game.screenshots.length > 0 && req.game.mapUrl;
    const editable =
      req.session.loggedInUser &&
      req.game.creator?._id?.toString() === req.session.loggedInUser?.id;
    const userRating = req.game.ratings?.find(
      (rating) => rating.user.toString() === req.session.loggedInUser?.id,
    )?.rating;
    const userHasRated = userRating !== undefined;

    res.render("game/index", {
      layout: "layouts/game",
      game,
      playable,
      editable,
      userRating,
      userHasRated,
    });
  }

  /**
   * Handles the creation of a new game.
   *
   * This method creates a new game entry in the database with default values
   * and redirects the client to the newly created game's page. If an error
   * occurs during the creation process, it responds with a 500 status code
   * and an error message.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A Promise that resolves when the response is sent.
   */
  async post(req: Request, res: Response) {
    try {
      const game = await GameModel.create({
        title: req.body.title ?? "",
        description: req.body.description ?? "",
        mapUrl: req.body.mapUrl ?? "",
        screenshots: [],
        creator: req.session.loggedInUser.id,
      });

      res.redirect(
        new URL(`./game/${game._id.toString()}/edit`, getUrl(req)).href,
      );
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Retrieves all game entries from the database and returns their IDs as relative paths.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the request-response cycle.
   * @returns A JSON response containing an array of relative paths to the game entries.
   * @throws Returns a 500 HTTP error if an error occurs during database retrieval.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const games = await GameModel.find().exec();
      res.json(games.map((game) => "./" + game._id.toString()));
    } catch {
      return next(createHttpError(500));
    }
  }

  /**
   * Handles the HTTP PUT request to update a game document.
   *
   * This method updates the properties of an existing game document
   * with the data provided in the request body.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response with a status code of 200 on success, or 500 with an error message
   *          if an internal server error occurs.
   */
  async put(req: Request, res: Response) {
    try {
      const game = req.game;
      game.title = req.body.title ?? "";
      game.description = req.body.description ?? "";

      if (req.file) {
        const image = await ImageModel.upload(req.file);
        game.mapUrl = `./image/${image._id.toString()}`;
      }

      await game.save();
      res.status(200).json({});
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the HTTP DELETE request to remove a game document.
   * @param req - The HTTP request object, expected to contain a `doc` property.
   * @param res - The HTTP response object used to send the JSON response.
   */
  async delete(req: Request, res: Response) {
    try {
      const game = req.game;
      await GameModel.findByIdAndDelete(game._id.toString()).exec();

      req.session.flash = {
        type: "success",
        message: "Game deleted",
      };
      res.json({
        message: "Game deleted",
      });
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the retrieval of data and sends it as a JSON response.
   * @param req - The HTTP request object, expected to contain a `doc` property.
   * @param res - The HTTP response object used to send the JSON response.
   * @param next - The next middleware function in the Express.js request-response cycle.
   * @throws {HttpError} Returns a 500 Internal Server Error if an exception occurs.
   */
  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(req.game.toObject());
    } catch {
      next(createHttpError(500));
    }
  }

  /**
   * Handles the GET request for the edit page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async getEdit(req: Request, res: Response) {
    res.render("game/edit", {
      game: req.game,
    });
  }

  /**
   * Handles the GET request for the edit location page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async getEditLocation(req: Request, res: Response) {
    res.render("game/editLocation", {
      game: req.game,
    });
  }

  /**
   * Handles the GET request for the upload page.
   * Renders the "game/upload" view to display the upload interface.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async uploadGet(req: Request, res: Response) {
    res.render("game/upload");
  }
}
