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

router.get('/mysnippets', controller.userSnippets)

router.get('/snippets/new', controller.sessionAuthorize, controller.newSnippetGet)
router.post('/snippets/create', controller.sessionAuthorize, controller.newSnippetPost)

router.get('/snippets/:id', controller.snippet)

router.get('/snippets/:id/edit', controller.sessionAuthorize, controller.snippetAuthorizeChanges, controller.snippetEdit)
router.post('/snippets/:id/update', controller.sessionAuthorize, controller.snippetAuthorizeChanges, controller.snippetUpdate)

router.get('/snippets/:id/remove', controller.sessionAuthorize, controller.snippetAuthorizeChanges, controller.snippetRemove)
router.post('/snippets/:id/delete', controller.sessionAuthorize, controller.snippetAuthorizeChanges, controller.snippetDelete)

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
