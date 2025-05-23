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
 * The auth router.
 * @module routes/authRouter
 */

import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();
export default router;

const controller = new AuthController();

router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);

router.get("/signup", controller.createGet);
router.post("/signup", controller.createPost);

router.get("/logout", controller.logoutGet);
