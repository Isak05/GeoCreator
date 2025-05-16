/**
 * The game router.
 *
 * @module routes/gameRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import GameController from "../controllers/GameController.js";
import GameModel from "../models/GameModel.js";
import screenshotRouter from "./screenshotRouter.js";
import multer from "multer";

const router = express.Router();
export default router;

const upload = multer({
  storage: multer.memoryStorage(),
});
const controller = new GameController();

router.param("gameId", controller.loadGame);
router.param("screenshotId", controller.loadScreenshot);

router.get("/", controller.getAll);
router.post("/", controller.post);

router.get("/:gameId", controller.get);
router.put(
  "/:gameId",
  GameModel.checkIfAllowedToEdit,
  upload.single("mapUrl"),
  controller.put,
);
router.delete("/:gameId", GameModel.checkIfAllowedToEdit, controller.delete);

router.get("/:gameId/data", controller.getData);

router.use("/:gameId/screenshot", screenshotRouter);

router.get("/:gameId/edit", GameModel.checkIfAllowedToEdit, controller.getEdit);

router.get(
  "/:gameId/edit/location",
  GameModel.checkIfAllowedToEdit,
  controller.getEditLocation,
);

router.get("/:gameId/highscore", controller.getHighscore);
router.post("/:gameId/highscore", controller.postHighscore);
