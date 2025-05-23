/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

/**
 * The main router.
 * @module routes/router
 */

import express from "express";
import createHttpError from "http-errors";
import homeRouter from "./homeRouter.js";
import imageRouter from "./imageRouter.js";
import gameRouter from "./gameRouter.js";
import authRouter from "./authRouter.js";
import uploadRouter from "./uploadRouter.js";
import myGamesRouter from "./myGamesRouter.js";

const router = express.Router();
export default router;

router.use("/", homeRouter);
router.use("/image", imageRouter);
router.use("/game", gameRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/my-games", myGamesRouter);
router.get("/privacy-policy", (req, res) => {
  res.render("legal/privacy-policy");
});
router.get("/contact", (req, res) => {
  res.render("legal/contact");
});
router.get("/license", (req, res) => {
  res.render("legal/license");
});

router.use("*", (req, res, next) => {
  return next(createHttpError(404));
});
