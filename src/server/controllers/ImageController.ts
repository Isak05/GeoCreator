/**
 * @file The images controller.
 * @module controllers/ImageController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import ImageModel from "../models/ImageModel.js";
import { Request, Response } from "express";
import { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      doc: Document;
    }
  }
}

/**
 * Controller for modifying resources via the api.
 */
export default class ImageController {
  /**
   * Middleware to load an image by ID and attach it to the request object.
   */
  async loadImage(
    req: Request,
    res: Response,
    next: Function,
    id: string
  ): Promise<void> {
    try {
      req.doc = await ImageModel.findById(id).exec();

      if (!req.doc) {
        throw new Error();
      }

      logger.silly(`Image with id ${id} found`);
      next();
    } catch (error) {
      return next(createHttpError(404));
    }
  }

  async getImage(req, res, next) {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(req.doc.getRaw());
  }
}
