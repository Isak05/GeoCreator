import "express";
import { File } from "node:buffer";

declare module "express-serve-static-core" {
  interface Request {
    doc: any;
    screenshot: any;
    session: {
      flash: {
        message: string;
        type: string;
      };
      loggedInUser: any;
    };
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    }
  }
}
