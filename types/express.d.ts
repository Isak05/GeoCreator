import "express";

declare module "express-serve-static-core" {
  interface Request {
    doc: any;
    session: {
      flash: {
        message: string;
        type: string;
      };
      loggedInUser: any;
    };
  }
}
