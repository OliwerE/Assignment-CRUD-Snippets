/**
 * Module represents the main router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as crudSnippetRouter } from './crud-snippet-router.js'
import { router as sessionRouter } from './session-router.js'
import { CrudSnippetController } from '../controllers/crud-snippet-controller.js'

export const router = express.Router()

const controller = new CrudSnippetController()

router.get('/', controller.index)

router.use('/crud', crudSnippetRouter)

router.use('/session', sessionRouter)

// fångar 404:or
router.use('*', (req, res, next) => {
    next(createError(404))
})

