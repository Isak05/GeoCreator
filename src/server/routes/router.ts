/**
 * The main router.
 *
 * @module routes/router
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import createHttpError from "http-errors";
import imageRouter from "./imageRouter.js";
import homeRouter from "./homeRouter.js";

const router = express.Router();
export default router;

router.use("/", homeRouter);
router.use("/image", imageRouter);

router.use("*", (req, res, next) => {
  return next(createHttpError(404));
});
