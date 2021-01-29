/**
 * Module represents the crud snippet router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { CrudSnippetController } from '../controllers/crud-snippet-controller.js'

export const router = express.Router()


const activeSessionCheck = (req, res, next) => {
    if (!req.session.userId) {
        res.status(404)
        res.render('errors/404') // obs måste ha denna status och render! krav för #10
    } else {
        next()
    }
}




const controller = new CrudSnippetController()

router.get('/', controller.index)

router.get('/snippets', controller.showSnippetsList)

router.get('/snippets/new', activeSessionCheck, controller.newSnippetGet) // fungerar endast om inloggad!
router.post('/snippets/create', activeSessionCheck, controller.newSnippetPost)

router.get('/snippets/:id', controller.snippet)

/*
// Login:
router.get('/login', controller.loginPage)
router.post('/login', controller.postLogin)

// Logout
router.post('/logout', controller.logout)

// Register
router.get('/register', controller.registerPage)
router.post('/register', controller.registerAccount)
*/

 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))