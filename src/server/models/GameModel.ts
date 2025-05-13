/**
 * The mongoose model for images.
 *
 * @module models/GameModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose, { Schema } from "mongoose";
import BASE_SCHEMA from "./baseSchema.js";
import UserModel from "./UserModel.js";
import { Request, Response } from "express";

const vec2Schema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const screenshotSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      auto: true,
    },
    url: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: vec2Schema,
      required: true,
    },
  },
  {
    _id: true,
  }
);

const highscoreSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const schema = new mongoose.Schema(
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
      required: true,
    },
    screenshots: {
      type: [screenshotSchema],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    highscoreList: {
      type: [highscoreSchema],
      required: false,
    },
  },
  {
    _id: false,
    id: false,
    statics: {
      checkIfAllowedToEdit(req: Request, res: Response, next: Function) {
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
  }
);

schema.add(BASE_SCHEMA);

const GameModel = mongoose.model("Game", schema);
export default GameModel;
