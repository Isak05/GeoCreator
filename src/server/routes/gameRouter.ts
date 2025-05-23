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
 * The game router.
 * @module routes/gameRouter
 */

import express from "express";
import GameController from "../controllers/GameController.js";
import GameModel from "../models/GameModel.js";
import screenshotRouter from "./screenshotRouter.js";
import highscoreRouter from "./highscoreRouter.js";
import ratingRouter from "./ratingRouter.js";
import multer from "multer";

const router = express.Router();
export default router;

const upload = multer({
  storage: multer.memoryStorage(),
});
const controller = new GameController();

router.param("gameId", controller.loadGame);

// Get all games
router.get("/", controller.getAll);

// Create, read, update and delete games
router.post("/", controller.post);
router.get("/:gameId", controller.get);
router.put(
  "/:gameId",
  GameModel.checkIfAllowedToEdit,
  upload.single("mapUrl"),
  controller.put,
);
router.delete("/:gameId", GameModel.checkIfAllowedToEdit, controller.delete);

// Get specific game data
router.get("/:gameId/data", controller.getData);

// Screenshots
router.use("/:gameId/screenshot", screenshotRouter);

// Editing games
router.get("/:gameId/edit", GameModel.checkIfAllowedToEdit, controller.getEdit);
router.get(
  "/:gameId/edit/location",
  GameModel.checkIfAllowedToEdit,
  controller.getEditLocation,
);

// Highscores
router.use("/:gameId/highscore", highscoreRouter);

// Rating
router.use("/:gameId/rating", ratingRouter);
