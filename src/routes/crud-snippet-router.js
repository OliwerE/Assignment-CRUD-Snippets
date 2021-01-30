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

const controller = new CrudSnippetController()

router.get('/', controller.index)

router.get('/snippets', controller.showSnippetsList)

router.get('/snippets/new', controller.sessionAuthorize, controller.newSnippetGet) // fungerar endast om inloggad!
router.post('/snippets/create', controller.sessionAuthorize, controller.newSnippetPost)

router.get('/snippets/:id', controller.snippet)

router.get('/snippets/:id/edit', controller.sessionAuthorize, controller.snippetEdit) // OBS! kontrollerar ej om det är ägaren! endast första kontroll
router.post('/snippets/:id/update', controller.sessionAuthorize, controller.snippetUpdate) // OBS! kontrollerar ej om det är ägaren! endast första kontroll


router.get('/snippets/:id/remove', controller.sessionAuthorize, controller.snippetRemove) // OBS! kontrollerar ej om det är ägaren! endast första kontroll
router.post('/snippets/:id/delete', controller.sessionAuthorize, controller.snippetDelete) // OBS! kontrollerar ej om det är ägaren! endast första kontroll


 // catch 404: alltid som sista route!
 router.use('*', (req, res, next) => next(createError(404)))