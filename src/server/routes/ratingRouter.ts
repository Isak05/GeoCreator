/**
 * The rating router.
 * @module routes/ratingRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import RatingController from "../controllers/RatingController.js";

const router = express.Router();
export default router;

const controller = new RatingController();

router.post("/", controller.post);
router.get("/", controller.get);
