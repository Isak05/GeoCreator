/**
 * @file The home controller.
 * @module controllers/GameController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import { Request, Response } from "express";
import { logger } from "../config/winston.js";
import createHttpError from "http-errors";
import UserModel from "../models/UserModel.js";

/**
 * Controller for accessing the home page
 */
export default class {
  /**
   * Handles the GET request for the login page.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   */
  async loginGet(req: Request, res: Response, next: Function) {
    res.render("auth/login");
  }

  /**
   * Handles the POST request for user login.
   * This method attempts to authenticate a user using the provided username and password.
   * If authentication is successful, the user's session is updated with a success message
   * and the user object, and the user is redirected to the base URL. If authentication fails
   * or an error occurs, the error is logged and passed to the next middleware.
   *
   * @param req - The HTTP request object, containing the username and password in the body.
   * @param res - The HTTP response object used to redirect the user or send an error response.
   * @param next - The next middleware function in the Express.js request-response cycle.
   * @throws {HttpError} If the username or password is invalid, a 401 Unauthorized error is thrown.
   */
  async loginPost(req: Request, res: Response, next: Function) {
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
      res.redirect("..");
    } catch (error) {
      req.session.flash = {
        type: "danger",
        message: "Invalid username or password",
      };
      res.redirect("./login");
    }
  }

  /**
   * Handles the GET request for rendering the "create" login page.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the request-response cycle.
   */
  async createGet(req: Request, res: Response, next: Function) {
    res.render("auth/signup");
  }

  /**
   * Handles the creation of a new user post by processing the request body,
   * saving the user to the database, and managing session data.
   *
   * @param req - The HTTP request object containing the user data in the body.
   * @param res - The HTTP response object used to redirect or send responses.
   * @param next - The next middleware function in the Express.js request-response cycle.
   */
  async createPost(req: Request, res: Response, next: Function) {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      if (await UserModel.isUsernameTaken(username)) {
        req.session.flash = {
          type: "danger",
          message: "Username already taken",
        };
        res.redirect("./signup");
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
      res.redirect("..");
    } catch (error) {
      req.session.flash = {
        type: "danger",
        message: "An error occured. Please try again.",
      };
      res.redirect("./signup");
    }
  }

  /**
   * Handles the logout process for a user by clearing the session data
   * and redirecting to the parent directory.
   *
   * @param req - The HTTP request object, containing session information.
   * @param res - The HTTP response object, used to redirect the user.
   * @param next - The next middleware function in the stack.
   */
  async logoutGet(req: Request, res: Response, next: Function) {
    req.session.flash = {
      type: "success",
      message: "Logged out",
    };
    req.session.loggedInUser = null;
    res.redirect("..");
  }
}
