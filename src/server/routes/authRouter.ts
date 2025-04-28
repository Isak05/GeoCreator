/**
 * The home router.
 *
 * @module routes/homeRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
