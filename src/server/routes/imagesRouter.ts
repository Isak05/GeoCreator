/**
 * The images router.
 *
 * @module routes/router
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import ImagesController from "../controllers/ImagesController.js";

const router = express.Router();
export default router;

const controller = new ImagesController()

router.param('id', controller.loadImage)
router.use("/:id", controller.getImage);
