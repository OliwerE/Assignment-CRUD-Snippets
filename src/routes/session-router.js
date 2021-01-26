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


const activeSessionCheck = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/') // om anv inte är inloggad öppnas inte nästa sida, ist redirect till start.
    } else {
        next()
    }
}




const controller = new SessionController()

// Login:
router.get('/login', controller.loginPage)
router.post('/login', controller.postLogin)

// Logout
router.post('/logout', controller.logout)

// Register
router.get('/register', controller.registerPage)
router.post('/register', controller.registerAccount)


 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))