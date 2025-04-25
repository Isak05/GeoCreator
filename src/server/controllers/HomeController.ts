/**
 * @file The home controller.
 * @module controllers/HomeController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";
import GameModel from "../models/GameModel.js";

/**
 * Controller for accessing the home page
 */
export default class HomeController {
  async get(req: Request, res: Response, next: Function) {
    const games = await GameModel.find({}).exec();
    res.render("home/index", { games });
  }
}
