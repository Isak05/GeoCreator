/**
 * This is the main entry point for the server.
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from "express";
import { logger } from "./config/winston.js";
import { connectToDatabase } from "./config/mongoose.js";
import router from "./routes/router.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "node:path";
import helmet from "./config/helmet.js";
import flash from "./middlewares/flash.js";
import expressLayouts from "express-ejs-layouts";
import session from "./config/session.js";

const PORT = process.env.PORT ?? 80;
const DEVELOPMENT_MODE = process.env.NODE_ENV === "development";
const BASE_URL = process.env.BASE_URL ?? "/";
const app = express();

try {
  await connectToDatabase(process.env.MONGODB_URI);

  app.use(helmet());
  app.use(session());
  app.use(flash());

  app.use(BASE_URL, express.static(path.resolve("./dist/client")));

  app.set("view engine", "ejs");
  app.set("views", path.resolve("./dist/server/views"));
  app.use(expressLayouts);
  app.set("layout", path.resolve("./dist/server/views/layouts/default"));
  app.set("layout extractScripts", true);
  app.set("layout extractStyles", true);
  app.set("layout extractMetas", true);

  app.use((req, res, next) => {
    // Pass the base URL to the views.
    res.locals.baseURL = process.env.BASE_URL ?? "/";
    res.locals.loggedInUser = req.session.loggedInUser;

    logger.http(
      `${req.method} ${req.url} ${req.session?.loggedInUser ? req.session.loggedInUser.username : "-"}`,
    );

    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(BASE_URL, router);
  app.use(errorHandler());

  // Allow secure cookies to be sent via HTTP from the reverse proxy in production.
  if (!DEVELOPMENT_MODE) {
    app.set("trust proxy", 1);
  }

  app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });
} catch (error) {
  logger.error(error);
  process.exitCode = 1;
}

export default app;
