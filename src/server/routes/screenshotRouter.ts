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
 * The screenshot router.
 * @module routes/screenshotRouter
 */

import express from "express";
import ScreenshotController from "../controllers/ScreenshotController.js";
import GameModel from "../models/GameModel.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();
export default router;

const controller = new ScreenshotController();

router.param("screenshotId", controller.loadScreenshot);

router.get("/:screenshotId", controller.get);
router.post(
  "/",
  GameModel.checkIfAllowedToEdit,
  upload.single("image"),
  controller.post,
);
router.put(
  "/:screenshotId",
  GameModel.checkIfAllowedToEdit,
  upload.single("image"),
  controller.put,
);
router.delete(
  "/:screenshotId",
  GameModel.checkIfAllowedToEdit,
  controller.delete,
);
