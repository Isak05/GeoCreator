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
 * The rating controller.
 * @module controllers/RatingController
 */

import { Request, Response } from "express";
import { logger } from "../config/winston.js";

/**
 * Controller for managing ratings in a game.
 * This controller handles the submission and retrieval of ratings for a game.
 */
export default class RatingController {
  /**
   * Handles the submission of a rating for a game.
   * @param req The express request object.
   * @param res The express response object.
   */
  async post(req: Request, res: Response) {
    try {
      const { rating } = req.body;

      // Validate the rating range
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        res.status(400).json({
          message: "Rating must be a number between 1 and 5",
        });
        return;
      }

      // Check if the user is logged in
      const user = req.session.loggedInUser;
      if (!user) {
        res.status(403).json({ message: "Must be logged in" });
        return;
      }

      // Check if the user has already rated the game
      const existingRating = req.game.ratings?.find(
        (rating) => rating.user.toString() === user.id,
      );

      // Add or update the rating
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        req.game.ratings?.push({ user: user.id, rating });
      }

      // Calculate the average rating and store it in the game object
      req.game.averageRating = req.game.ratings?.reduce(
        (acc, rating) => acc + rating.rating,
        0,
      );
      req.game.averageRating /= req.game.ratings?.length || 1;

      await req.game.save();

      res.json({ averageRating: req.game.averageRating });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Handles the retrieval of the highscore list for a game.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the highscore list as a JSON response.
   */
  async get(req: Request, res: Response) {
    res.json({ averageRating: req.game?.averageRating });
  }
}
