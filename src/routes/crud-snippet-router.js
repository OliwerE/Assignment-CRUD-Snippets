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

router.get('/snippets/:id/edit', activeSessionCheck, controller.snippetEdit) // OBS! kontrollerar ej om det är ägaren! endast första kontroll
router.post('/snippets/:id/update', activeSessionCheck, controller.snippetUpdate) // OBS! kontrollerar ej om det är ägaren! endast första kontroll


router.get('/snippets/:id/remove', activeSessionCheck, controller.snippetRemove) // OBS! kontrollerar ej om det är ägaren! endast första kontroll
router.post('/snippets/:id/delete', activeSessionCheck, controller.snippetDelete) // OBS! kontrollerar ej om det är ägaren! endast första kontroll


 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))