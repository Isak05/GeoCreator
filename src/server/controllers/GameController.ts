/**
 * @file The home controller.
 * @module controllers/GameController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";
import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import GameModel from "../models/GameModel.js";
import ImageModel from "../models/ImageModel.js";

/**
 * Controller for accessing the home page
 */
export default class {
  /**
   * Middleware to load a game document by its ID and attach it to the request object.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function in the stack.
   * @param id - The ID of the game to load.
   *
   * @throws Will call the next middleware with a 404 HTTP error if the game is not found.
   */
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

  async loadScreenshot(
    req: Request,
    res: Response,
    next: Function,
    id: string
  ): Promise<void> {
    try {
      req.screenshot = req.doc.screenshots.find((screenshot: any) => {
        return screenshot.id === id;
      });

      if (!req.screenshot) {
        throw new Error();
      }
    } catch (error) {
      res.status(404).json({
        message: "Screenshot not found",
      });
    }

    next();
  }

  /**
   * Handles the GET request to render the game index page.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   * @returns A rendered view of the "game/index" page.
   */
  async get(req: Request, res: Response, next: Function) {
    res.render("game/index");
  }

  /**
   * Handles the creation of a new game.
   *
   * This method creates a new game entry in the database with default values
   * and redirects the client to the newly created game's page. If an error
   * occurs during the creation process, it responds with a 500 status code
   * and an error message.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   *
   * @returns A Promise that resolves when the response is sent.
   */
  async post(req: Request, res: Response, next: Function) {
    try {
      const game = await GameModel.create({
        title: req.body.title ?? "",
        description: req.body.description ?? "",
        mapUrl: req.body.mapUrl ?? "./placeholder_map.webp",
        screenshots: [],
      });

      res.redirect(`./game/${game._id.toString()}/edit`);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Retrieves all game entries from the database and returns their IDs as relative paths.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the request-response cycle.
   * @returns A JSON response containing an array of relative paths to the game entries.
   * @throws Returns a 500 HTTP error if an error occurs during database retrieval.
   */
  async getAll(req: Request, res: Response, next: Function) {
    try {
      const games = await GameModel.find().exec();
      res.json(games.map((game) => "./" + game._id.toString()));
    } catch (error) {
      return next(createHttpError(500));
    }
  }

  /**
   * Handles the HTTP PUT request to update a game document.
   *
   * This method updates the properties of an existing game document
   * with the data provided in the request body.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response with a status code of 200 on success, or 500 with an error message
   *          if an internal server error occurs.
   */
  async put(req: Request, res: Response, next: Function) {
    try {
      const game = req.doc;
      game.title = req.body.title ?? "";
      game.description = req.body.description ?? "";

      if (req.file) {
        const image = await ImageModel.upload(req.file);
        game.mapUrl = `./image/${image._id.toString()}`;
      }

      await game.save();
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the retrieval of data and sends it as a JSON response.
   *
   * @param req - The HTTP request object, expected to contain a `doc` property.
   * @param res - The HTTP response object used to send the JSON response.
   * @param next - The next middleware function in the Express.js request-response cycle.
   * @throws {HttpError} Returns a 500 Internal Server Error if an exception occurs.
   */
  async getData(req: Request, res: Response, next: Function) {
    try {
      res.json(req.doc.toObject());
    } catch (error) {
      return next(createHttpError(500));
    }
  }

  async getEdit(req: Request, res: Response, next: Function) {
    res.render("game/edit", {
      game: req.doc,
    });
  }

  /**
   * Handles the GET request for the upload page.
   * Renders the "game/upload" view to display the upload interface.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   */
  async uploadGet(req: Request, res: Response, next: Function) {
    res.render("game/upload");
  }

  /**
   * Handles the POST request to upload a screenshot for a game. Accepts an image file either as a form-data upload or as a base64-encoded string in the request body.
   *
   * @param req - The HTTP request object containing the uploaded file and game information.
   * @param res - The HTTP response object used to send the response.
   * @param next - The next middleware function in the stack.
   */
  async postScreenshot(req: Request, res: Response, next: Function) {
    try {
      const game = req.doc;
      if (req.file === undefined && req.body.image === undefined) {
        return res.status(400).json({
          message: "No image provided",
        });
      }

      const image = await ImageModel.upload(req.file ?? req.body.image);
      const screenshot = {
        url: `./image/${image._id.toString()}`,
        correctAnswer: {
          x: parseFloat(req.body.x),
          y: parseFloat(req.body.y),
        },
      };

      game.screenshots.push(screenshot);
      await game.save();

      const screenshotId =
        game.screenshots[game.screenshots.length - 1]._id.toString();
      const location = `./game/${game._id.toString()}/screenshot/${screenshotId}`;
      res.status(201).location(location).json({
        url: location,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the retrieval of a screenshot and sends it as a JSON response.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the JSON response.
   * @param next - The next middleware function in the request-response cycle.
   */
  async getScreenshot(req: Request, res: Response, next: Function) {
    try {
      res.json(req.screenshot);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the updating of a screenshot for a game.
   * 
   * This method processes a request to update a screenshot associated with a game.
   * It supports uploading a new image file, updating the screenshot's URL, and
   * modifying the correct answer coordinates (x and y).
   * 
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async putScreenshot(req: Request, res: Response, next: Function) {
    try {
      const game = req.doc;
      const screenshot = req.screenshot;

      if (req.file ?? req.body.image) {
        const image = await ImageModel.upload(req.file);
        screenshot.url = `./image/${image._id.toString()}`;
      }

      if (req.body.x !== undefined) {
        screenshot.correctAnswer.x = req.body.x;
      }
      if (req.body.y !== undefined) {
        screenshot.correctAnswer.y = parseFloat(req.body.y);
      }

      await game.save();
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Deletes a screenshot from the game's screenshots array and saves the updated game document.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async deleteScreenshot(req: Request, res: Response, next: Function) {
    try {
      const game = req.doc;
      const screenshot = req.screenshot;

      game.screenshots = game.screenshots.filter((s: any) => {
        return s.id !== screenshot.id;
      });

      await game.save();
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
