/**
 * The game router.
 *
 * @module routes/gameRouter
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import GameController from "../controllers/GameController.js";
import multer from "multer";

const router = express.Router();
export default router;

const upload = multer({
  storage: multer.memoryStorage(),
});
const controller = new GameController();

router.param("id", controller.loadGame);

router.get("/", controller.getAll);
router.post("/", controller.post);

router.get("/:id", controller.get);
router.put("/:id", upload.single("mapUrl"), controller.put);
router.get("/:id/data", controller.getData);

router.get("/:id/edit", controller.getEdit);
