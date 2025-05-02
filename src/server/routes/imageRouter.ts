/**
 * The image router.
 *
 * @module routes/imageRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import ImageController from "../controllers/ImageController.js";

const router = express.Router();
export default router;

const controller = new ImageController();

router.param("id", controller.loadImage);

router.get("/:id", controller.getImage);
