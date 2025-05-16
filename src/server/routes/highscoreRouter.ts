/**
 * The highscore router.
 *
 * @module routes/highscoreRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import HighscoreController from "../controllers/HighscoreController.js";

const router = express.Router();
export default router;

const controller = new HighscoreController();

router.post("/", controller.post);
router.get("/", controller.get);
