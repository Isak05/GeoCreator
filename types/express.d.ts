import "express";
import type { Screenshot } from "../src/server/models/ScreenshotSchema";
import type { User } from "../src/server/models/UserModel";
import type { HydratedDocument } from "mongoose";
import { Image, ImageMethods } from "../src/server/models/ImageModel.js";
import { Game } from "../src/server/models/GameModel.js";

declare module "express-serve-static-core" {
  interface Request {
    game: HydratedDocument<Game>;
    image: HydratedDocument<Image, ImageMethods>;
    screenshot: Screenshot;
    session: {
      flash: {
        message: string;
        type: string;
      };
      loggedInUser: User;
    };
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    };
  }
}
