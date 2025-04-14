/**
 * @file The image controller.
 * @module controllers/api/ImageController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import createHttpError from 'http-errors'
import ImageModel from '../models/ImageModel.js'

/**
 * Controller for modifying resources via the api.
 */
export default class ImageController {
  /**
   * Middleware to load an image by ID and attach it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the image to load.
   * @returns {Promise<void>} - A promise that resolves when the image is loaded.
   */
  async loadImage (req, res, next, id) {
    try {
      req.doc = await ImageModel.findById(id).exec()

      if (!req.doc) {
        throw new Error()
      }

      logger.silly(`Image with id ${id} found`)
      next()
    } catch (error) {
      return next(createHttpError(404))
    }
  }

  async getImage (req, res, next) {
    res.setHeader('Content-Type', 'image/jpeg')
    res.send(req.doc.getRaw())
  }
}
