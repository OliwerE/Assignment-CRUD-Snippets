/**
 * Module represents the crud snippet router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { SessionController } from '../controllers/session-controller.js'

export const router = express.Router()

const controller = new SessionController()

router.get('/login', controller.inactiveSessionCheck, controller.loginPage)
router.post('/login', controller.inactiveSessionCheck, controller.postLogin)

router.post('/logout', controller.activeSessionCheck, controller.logout)

router.get('/register', controller.inactiveSessionCheck, controller.registerPage)
router.post('/register', controller.inactiveSessionCheck, controller.registerAccount)

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
