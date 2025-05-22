/**
 * @file The images controller.
 * @module controllers/ImageController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import ImageModel, { Image, ImageMethods } from "../models/ImageModel.js";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

/**
 * Controller for modifying resources via the api.
 */
export default class ImageController {
  /**
   * Middleware to load an image by ID and attach it to the request object.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function in the stack.
   * @param id - The ID of the image to load.
   * @returns A promise that resolves when the image is loaded.
   */
  async loadImage(
    req: Request,
    res: Response,
    next: NextFunction,
    id: string,
  ): Promise<void> {
    try {
      req.image = (await ImageModel.findById(
        id,
      ).exec()) as mongoose.HydratedDocument<Image, ImageMethods>;

      if (!req.image) {
        throw new Error();
      }

      logger.silly(`Image with id ${id} found`);
      next();
    } catch {
      return next(createHttpError(404));
    }
  }

  /**
   * Handles the GET request to retrieve an image by its ID.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async getImage(req: Request, res: Response): Promise<void> {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(req.image.getRaw());
  }
}
