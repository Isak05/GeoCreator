/**
 * @file The home controller.
 * @module controllers/HomeController
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

/**
 * Controller for accessing the home page
 */
export default class HomeController {
  async get (req, res, next) {
    res.render('home/index')
  }
}
