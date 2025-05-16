/**
 * The mongoose model for games.
 *
 * @module models/GameModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose, { Schema } from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import UserModel from "./UserModel.js";
import ScreenshotSchema from "./ScreenshotSchema.js";
import HighscoreSchema from "./HighscoreSchema.js";
import { NextFunction, Request, Response } from "express";

interface Game {
  title: string;
  description?: string;
  mapUrl?: string;
  screenshots: mongoose.Types.Array<typeof ScreenshotSchema>;
  creator: mongoose.Types.ObjectId;
  highscoreList?: mongoose.Types.Array<typeof HighscoreSchema>;
}

const schema = new mongoose.Schema<Game>(
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
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    highscoreList: {
      type: [HighscoreSchema],
      required: false,
    },
  },
  {
    _id: false,
    id: false,
    statics: {
      checkIfAllowedToEdit(req: Request, res: Response, next: NextFunction) {
        if (
          req.doc.creator?.id === undefined ||
          req.session.loggedInUser?.id === undefined ||
          req.doc.creator?.id !== req.session.loggedInUser.id
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

const GameModel = mongoose.model<Game>("Game", schema);
export default GameModel;
