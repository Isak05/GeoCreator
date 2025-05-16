/**
 * The screenshot router.
 *
 * @module routes/screenshotRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
