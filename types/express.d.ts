import "express";
import GameModel from "../src/server/models/GameModel";
import type { Screenshot } from "../src/server/models/ScreenshotSchema";
import type { User } from "../src/server/models/UserModel";
import type { HydratedDocument } from "mongoose";
import ImageModel from "../src/server/models/ImageModel.js";

declare module "express-serve-static-core" {
  interface Request {
    doc:
      | HydratedDocument<typeof GameModel>
      | HydratedDocument<typeof ImageModel>;
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
