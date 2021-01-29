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
        res.status(404)
        res.render('errors/404') // obs måste ha denna status och render! krav för #15
        //res.redirect('/') // om anv inte är inloggad öppnas inte nästa sida, ist redirect till start.
    } else {
        next()
    }
}

const inactiveSessionCheck = (req, res, next) => { // om användare är inloggad öppnas inte sidan
    if (req.session.userId) {

        // err kod här!!

        const viewData = {
            auth: true
        }
        res.render('errors/error', { viewData })
    } else {
        next()
    }
}




const controller = new SessionController()

// Login:
router.get('/login', inactiveSessionCheck, controller.loginPage)
router.post('/login',inactiveSessionCheck, controller.postLogin)

// Logout
router.post('/logout', activeSessionCheck, controller.logout)

// Register
router.get('/register', inactiveSessionCheck, controller.registerPage)
router.post('/register',inactiveSessionCheck, controller.registerAccount)


 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))