/**
 * The upload controller.
 * @module controllers/UploadController
 */

import { Request, Response } from "express";

/**
 * Controller for accessing the upload page
 */
export default class {
  /**
   * Renders the upload page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async get(req: Request, res: Response) {
    res.render("upload");
  }
}
