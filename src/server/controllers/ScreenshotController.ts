/**
 * @file The screenshot controller.
 * @module controllers/ScreenshotController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { NextFunction, Request, Response } from "express";
import ImageModel from "../models/ImageModel.js";
import { Screenshot } from "../models/ScreenshotSchema.js";

/**
 * Controller for accessing the home page
 */
export default class ScreenshotController {
  async loadScreenshot(
    req: Request,
    res: Response,
    next: NextFunction,
    id: string,
  ): Promise<void> {
    try {
      req.screenshot = req.doc.screenshots.find((screenshot: Screenshot) => {
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
   *
   * @param req - The HTTP request object containing the uploaded file and game information.
   * @param res - The HTTP response object used to send the response.
   * @param next - The next middleware function in the stack.
   */
  async post(req: Request, res: Response) {
    try {
      const game = req.doc;
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
    } catch {
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
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async put(req: Request, res: Response) {
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
    } catch {
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
  async delete(req: Request, res: Response) {
    try {
      const game = req.doc;
      const screenshot = req.screenshot;

      game.screenshots = game.screenshots.filter((s: Screenshot) => {
        return s.id !== screenshot.id;
      });

      await game.save();
      res.status(200).json({});
    } catch {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
