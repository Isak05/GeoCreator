/**
 * @file The home controller.
 * @module controllers/GameController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";

/**
 * Controller for accessing the home page
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
