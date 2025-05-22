/**
 * The my games router.
 * @module routes/myGamesRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import MyGamesController from "../controllers/MyGamesController.js";

const router = express.Router();
export default router;

const controller = new MyGamesController();

router.get("/", controller.get);
