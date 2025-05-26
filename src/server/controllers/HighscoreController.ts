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
 * The highscore controller.
 * @module controllers/HighscoreController
 */

import { Request, Response } from "express";
import { Highscore } from "../models/HighscoreSchema.js";
import mongoose from "mongoose";
import { logger } from "../config/winston.js";

/**
 * Controller for managing high scores in a game.
 * This controller handles the submission and retrieval of high scores for a game.
 */
export default class HighscoreController {
  /**
   * Handles the submission of a high score for a game.
   *
   * This method checks if the logged-in user already has a high score in the game's high score list.
   * If a high score exists, it updates the score and time if the new score is higher or if the score
   * is the same but the time is better. If no high score exists for the user, it adds a new entry
   * to the high score list.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send the response back to the client.
   * @returns A JSON response with a status code and a message indicating the result.
   */
  async post(req: Request, res: Response) {
    try {
      // If we're not logged in, we can't post a highscore
      if (!req.session.loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      const game = req.game;
      game.highscoreList ??= [] as mongoose.Types.DocumentArray<Highscore>;

      // Find any existing highscore for the logged-in user
      const existingHighscore = game.highscoreList.find(
        (highscore: Highscore) => {
          return (
            highscore.user &&
            highscore.user?.id === req.session.loggedInUser?.id
          );
        },
      );

      // If a highscore already exists, update it if the new score is higher
      if (existingHighscore) {
        // If the new score is higher or the same but the time is better, update the highscore
        if (
          req.body?.score > existingHighscore.score ||
          (req.body?.score === existingHighscore.score &&
            req.body?.time < existingHighscore.time)
        ) {
          existingHighscore.score = req.body?.score;
          existingHighscore.time = req.body?.time;
          await game.save();
        }

        // Respond with 200 OK and the highscore list
        res.status(200).json(game.highscoreList);
        return;
      } else {
        // If no highscore exists, create a new one
        game.highscoreList.push({
          user: req.session.loggedInUser?.id,
          score: req.body?.score,
          time: req.body?.time,
        });
        await game.save();
        await game.populate("highscoreList.user");
      }

      // Respond with 201 Created and the highscore list
      res.status(201).json(game.highscoreList);
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
    res.json(req.game?.highscoreList.toObject());
  }
}
