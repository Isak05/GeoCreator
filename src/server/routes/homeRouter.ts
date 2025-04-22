/**
 * The home router.
 *
 * @module routes/homeRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import HomeController from "../controllers/HomeController.js";

const router = express.Router();
export default router;

const controller = new HomeController()

router.use("/", controller.get);
