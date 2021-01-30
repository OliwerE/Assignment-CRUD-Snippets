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

// Login:
router.get('/login', controller.inactiveSessionCheck, controller.loginPage)
router.post('/login',controller.inactiveSessionCheck, controller.postLogin)

// Logout
router.post('/logout', controller.activeSessionCheck, controller.logout)

// Register
router.get('/register', controller.inactiveSessionCheck, controller.registerPage)
router.post('/register',controller.inactiveSessionCheck, controller.registerAccount)


 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))