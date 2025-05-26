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
 * The screenshot controller.
 * @module controllers/ScreenshotController
 */

import { NextFunction, Request, Response } from "express";
import ImageModel from "../models/ImageModel.js";
import { Screenshot } from "../models/ScreenshotSchema.js";
import { logger } from "../config/winston.js";

/**
 * Controller for creating, updating, and deleting screenshots for games.
 */
export default class ScreenshotController {
  /**
   * Middleware to load a screenshot by ID and attach it to the request object.
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
   * Handles the POST request to upload a screenshot for a game. Accepts an image file either as a form-data upload or as a base64-encoded string in the request body.
   * @param req - The HTTP request object containing the uploaded file and game information.
   * @param res - The HTTP response object used to send the response.
   */
  async post(req: Request, res: Response) {
    try {
      const game = req.game;
      if (req.file === undefined && req.body.image === undefined) {
        res.status(400).json({
          message: "No image provided",
        });
        return;
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

      const newScreenshot = game.screenshots[game.screenshots.length - 1];
      const screenshotId = newScreenshot._id.toString();
      const location = `./game/${game._id.toString()}/screenshot/${screenshotId}`;
      res.status(201).location(location).json(newScreenshot);
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the retrieval of a screenshot and sends it as a JSON response.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the JSON response.
   */
  async get(req: Request, res: Response) {
    try {
      res.json(req.screenshot);
    } catch {
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
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   */
  async put(req: Request, res: Response) {
    try {
      const game = req.game;
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
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Deletes a screenshot from the game's screenshots array and saves the updated game document.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   */
  async delete(req: Request, res: Response) {
    try {
      const game = req.game;
      const screenshot = req.screenshot;

      game.screenshots.pull({ _id: screenshot.id });

      await game.save();
      res.status(200).json({});
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
