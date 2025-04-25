/**
 * The home router.
 *
 * @module routes/homeRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import GameController from "../controllers/GameController.js";

const router = express.Router();
export default router;

const controller = new GameController();

router.param("id", controller.loadGame);

router.get("/", controller.getAll);
router.get("/:id", controller.get);
router.get("/:id/data", controller.getData);
