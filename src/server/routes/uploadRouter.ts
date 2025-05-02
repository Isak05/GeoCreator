/**
 * The upload router.
 *
 * @module routes/uploadRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import UploadController from "../controllers/UploadController.js";

const router = express.Router();
export default router;

const controller = new UploadController();

router.get("/", controller.get);