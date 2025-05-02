/**
 * The main router.
 *
 * @module routes/router
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import createHttpError from "http-errors";
import homeRouter from "./homeRouter.js";
import imageRouter from "./imageRouter.js";
import gameRouter from "./gameRouter.js";
import authRouter from "./authRouter.js";
import uploadRouter from "./uploadRouter.js";

const router = express.Router();
export default router;

router.use("/", homeRouter);
router.use("/image", imageRouter);
router.use("/game", gameRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);

router.use("*", (req, res, next) => {
  return next(createHttpError(404));
});
