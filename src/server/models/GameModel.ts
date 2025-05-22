/**
 * The mongoose model for games.
 * @module models/GameModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import { User } from "./UserModel.js";
import ScreenshotSchema, { Screenshot } from "./ScreenshotSchema.js";
import HighscoreSchema, { Highscore } from "./HighscoreSchema.js";
import RatingSchema, { Rating } from "./RatingSchema.js";
import { NextFunction, Request, Response } from "express";

export interface Game {
  title: string;
  description?: string;
  mapUrl?: string;
  screenshots?: mongoose.Types.DocumentArray<Screenshot>;
  creator: User;
  highscoreList?: mongoose.Types.DocumentArray<Highscore>;
  ratings?: mongoose.Types.DocumentArray<Rating>;
  averageRating: number;
}

interface GameModel extends mongoose.Model<Game> {
  checkIfAllowedToEdit(req: Request, res: Response, next: NextFunction): void;
}

const schema = new mongoose.Schema<Game, GameModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    mapUrl: {
      type: String,
      required: false,
    },
    screenshots: {
      type: [ScreenshotSchema],
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    highscoreList: {
      type: [HighscoreSchema],
      required: false,
    },
    ratings: {
      type: [RatingSchema],
      required: false,
    },
    averageRating: {
      type: Number,
      default: 3,
      required: true,
    },
  },
  {
    _id: false,
    id: false,
    statics: {
      /**
       * Middleware that checks if the user is allowed to edit the game. If the user is not allowed to edit, a 403 Forbidden response is sent.
       * @param req - The HTTP request object.
       * @param res - The HTTP response object.
       * @param next - The next middleware function in the stack.
       */
      checkIfAllowedToEdit(req: Request, res: Response, next: NextFunction) {
        if (
          req.game.creator?.id === undefined ||
          req.session.loggedInUser?.id === undefined ||
          req.game.creator?.id !== req.session.loggedInUser.id
        ) {
          res.status(403).json({
            message: "Forbidden",
          });
          return;
        }
        next();
      },
    },
  },
);

schema.add(BASE_SCHEMA);

const GameModel = mongoose.model<Game, GameModel>("Game", schema);

export default GameModel;
