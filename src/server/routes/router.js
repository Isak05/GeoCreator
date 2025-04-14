/**
 * The main router.
 *
 * @module routes/router
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import express from 'express'
import createHttpError from 'http-errors'

const router = express.Router()
export default router

router.use('/', (req, res, next) => {
  next()
}
)

router.use('*', (req, res, next) => {
  return next(createHttpError(404))
})
