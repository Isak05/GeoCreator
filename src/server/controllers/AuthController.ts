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
 * The auth controller.
 * @module controllers/AuthController
 */

import { Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/UserModel.js";
import getUrl from "../utils/getUrl.js";

/**
 * Controller for accessing the auth pages, such as login and signup.
 */
export default class {
  /**
   * Handles the GET request for the login page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async loginGet(req: Request, res: Response) {
    res.render("auth/login");
  }

  /**
   * Handles the POST request for user login.
   * This method attempts to authenticate a user using the provided username and password.
   * If authentication is successful, the user's session is updated with a success message
   * and the user object, and the user is redirected to the base URL. If authentication fails
   * or an error occurs, the error is logged and passed to the next middleware.
   * @param req - The HTTP request object, containing the username and password in the body.
   * @param res - The HTTP response object used to redirect the user or send an error response.
   * @throws {HttpError} If the username or password is invalid, a 401 Unauthorized error is thrown.
   */
  async loginPost(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const user = await UserModel.authenticate(username, password);

      if (!user) {
        throw createHttpError(401, "Invalid username or password");
      }

      req.session.flash = {
        type: "success",
        message: "Logged in as " + user.username,
      };
      req.session.loggedInUser = user;
      res.redirect(new URL("..", getUrl(req)).href);
    } catch {
      req.session.flash = {
        type: "danger",
        message: "Invalid username or password",
      };
      res.redirect(getUrl(req));
    }
  }

  /**
   * Handles the GET request for rendering the "create" login page.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   */
  async createGet(req: Request, res: Response) {
    res.render("auth/signup");
  }

  /**
   * Handles the creation of a new user post by processing the request body,
   * saving the user to the database, and managing session data.
   * @param req - The HTTP request object containing the user data in the body.
   * @param res - The HTTP response object used to redirect or send responses.
   */
  async createPost(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      if (await UserModel.isUsernameTaken(username)) {
        req.session.flash = {
          type: "danger",
          message: "Username already taken",
        };
        res.redirect(new URL("./signup", getUrl(req)).href);
        return;
      }

      // Create user
      const user = new UserModel({ username, password });
      await user.save();

      req.session.loggedInUser = user;
      req.session.flash = {
        type: "success",
        message: "Successfully signed up",
      };
      res.redirect(new URL("..", getUrl(req)).href);
    } catch {
      req.session.flash = {
        type: "danger",
        message: "An error occured. Please try again.",
      };
      res.redirect(new URL("./signup", getUrl(req)).href);
    }
  }

  /**
   * Handles the logout process for a user by clearing the session data
   * and redirecting to the parent directory.
   * @param req - The HTTP request object, containing session information.
   * @param res - The HTTP response object, used to redirect the user.
   */
  async logoutGet(req: Request, res: Response) {
    req.session.flash = {
      type: "success",
      message: "Logged out",
    };
    req.session.loggedInUser = null;
    res.redirect(new URL("..", getUrl(req)).href);
  }
}
