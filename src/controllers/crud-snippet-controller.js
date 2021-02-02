/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Snippet } from '../models/snippet-model.js'
import moment from 'moment'

/**
 * Class represents a controller used to render pages for users.
 */
export class CrudSnippetController {
  /**
   * Used to verify if a user is logged in.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Returns data to next function.
   */
  sessionAuthorize (req, res, next) {
    try {
      if (!req.session.userName) { // true is logged in
        const error = new Error('Not Found')
        error.status = 404
        return next(error)
      } else {
        next()
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Used to verify if a user is the owner of a snippet.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Returns to the next function
   */
  async snippetAuthorizeChanges (req, res, next) {
    try {
      const snippetID = req.params.id
      const sessionUserName = req.session.userName

      const foundSnippet = await Snippet.find({ _id: snippetID })

      if (foundSnippet.length === 1) {
        if ((foundSnippet[0].owner === sessionUserName) && ((foundSnippet[0].owner !== undefined) || (sessionUserName !== undefined))) {
          return next()
        } if ((foundSnippet[0].owner !== sessionUserName) && ((foundSnippet[0].owner !== undefined) || (sessionUserName !== undefined))) {
          const error = new Error('Forbidden')
          error.status = 403
          return next(error)
        } else {
          const error = new Error('Internal Server Error')
          error.status = 500
          return next(error)
        }
      } else if (foundSnippet.length === 0) {
        const error = new Error('Not Found')
        error.status = 404
        return next(error)
      } else {
        const error = new Error('Internal Server Error')
        error.status = 500
        return next(error)
      }
    } catch (err) {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * Responds with the index page to a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  index (req, res, next) {
    try {
      if (req.session.userName !== undefined) { // Adds sign out button and username if logged in
        const viewData = {
          auth: true,
          userName: req.session.userName
        }
        res.render('crud-snippets/index', { viewData })
      } else {
        res.render('crud-snippets/index')
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Responds with a page displaying all snippets in the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async showSnippetsList (req, res, next) {
    try {
      const viewData = {}
      if (req.session.userName !== undefined) {
        viewData.auth = true
        viewData.userName = req.session.userName
      }
      const snippetsInStorage = (await Snippet.find({})).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        owner: Snippet.owner,
        createdAt: moment(Snippet.createdAt).fromNow(),
        modifiedAt: moment(Snippet.updatedAt).fromNow()
      }))
      viewData.snippets = snippetsInStorage.reverse() // Adds all snippets to viewData. (Newest snippet first)

      res.render('crud-snippets/snippets', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Responds with a page displaying all snippets created by the user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async userSnippets (req, res, next) {
    try {
      const viewData = {}
      if (req.session.userName !== undefined) {
        viewData.auth = true
        viewData.userName = req.session.userName
      }
      const snippetsInStorage = (await Snippet.find({ owner: req.session.userName })).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        createdAt: moment(Snippet.createdAt).fromNow(),
        modifiedAt: moment(Snippet.updatedAt).fromNow()
      }))
      viewData.snippets = snippetsInStorage.reverse() // Adds all snippets to viewData. (Newest snippet first)

      res.render('crud-snippets/mysnippets', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Responds with the create snippet page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  newSnippetGet (req, res, next) {
    try {
      if (req.session.userName !== undefined) { // Adds sign out button and username if logged in
        const viewData = {
          auth: true,
          userName: req.session.userName
        }
        res.render('crud-snippets/new', { viewData })
      } else {
        res.render('crud-snippets/new')
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Adds a new snippet to the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Redirects user to the snippets list or new snippet.
   */
  async newSnippetPost (req, res, next) {
    try {
      const snippetName = req.body.name
      const snippetData = req.body.snippet

      if (snippetName.length === 0 || snippetData.length === 0) {
        req.session.flash = { type: 'flashError', message: 'Enter both fields!' }
        return res.redirect('./new')
      }

      if (snippetName.length > 25) {
        req.session.flash = { type: 'flashError', message: 'Snippet name is too long!' }
        return res.redirect('./new')
      }

      const newSnippet = new Snippet({
        name: snippetName,
        snippet: snippetData,
        owner: req.session.userName
      })

      await newSnippet.save()

      req.session.flash = { type: 'flashSuccess', message: 'Your snippet has been created!' }
      return res.redirect('/crud/snippets')
    } catch (err) {
      req.session.flash = { type: 'flashError', message: 'Could not save snippet' }
      return res.redirect('./new')
    }
  }

  /**
   * Responds with a page displaying the requested snippet.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async snippet (req, res, next) {
    try {
      const reqSnippet = req.params.id

      const viewData = {}
      if (req.session.userName !== undefined) { // Adds sign out button and username if logged in
        viewData.auth = true
        viewData.userName = req.session.userName
      }

      const foundSnippet = (await Snippet.find({ _id: reqSnippet })).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        owner: Snippet.owner,
        snippet: Snippet.snippet,
        createdAt: moment(Snippet.createdAt).fromNow(),
        updatedAt: moment(Snippet.updatedAt).fromNow()
      }))
      viewData.snippet = foundSnippet[0]

      if (req.session.userName === foundSnippet[0].owner) { // Adds edit and remove buttons if the user owns the snippet
        viewData.isOwner = 'true'
      }

      res.render('crud-snippets/snippet', { viewData })
    } catch {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * Responds with the requested snippets edit page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async snippetEdit (req, res, next) {
    try {
      const snippetID = req.params.id

      const foundSnippet = (await Snippet.find({ _id: snippetID })).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        snippet: Snippet.snippet
      }))

      const viewData = {
        auth: true,
        userName: req.session.userName,
        snippet: foundSnippet[0]
      }

      res.render('crud-snippets/edit', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Updates a snippet name and/or snippet in the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Redirects user to edit snippet page.
   */
  async snippetUpdate (req, res, next) {
    try {
      const snippetID = req.params.id
      const snippetName = req.body.name
      const snippetData = req.body.snippet

      if (snippetName.length === 0 || snippetData.length === 0) {
        req.session.flash = { type: 'flashError', message: 'Enter both fields!' }
        return res.redirect('./edit')
      }

      if (snippetName.length > 25) {
        req.session.flash = { type: 'flashError', message: 'Snippet name is too long!' }
        return res.redirect('./edit')
      }

      const _res = res
      const _req = req
      await Snippet.updateOne({ _id: snippetID }, { name: snippetName, snippet: snippetData }, (err, res) => { // Updates snippet name and data in the database
        if (err) {
          const error = new Error('Internal Server Error')
          error.status = 500
          next(error)
        }
        if (res) {
          console.log(res)
          if (res.n === 0) {
            _req.session.flash = { type: 'flashError', message: 'Could not update snippet' }
            _res.redirect('./edit')
          } else if (res.n === 1) {
            _req.session.flash = { type: 'flashSuccess', message: 'The snippet has been updated successfully.' }
            _res.redirect('./')
          } else {
            const error = new Error('Internal Server Error')
            error.status = 500
            next(error)
          }
        }
      })
    } catch (err) {
      req.session.flash = { type: 'flashError', message: 'Could not update snippet' }
      res.redirect('./edit')
    }
  }

  /**
   * Responds with a snippets remove page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async snippetRemove (req, res, next) {
    try {
      const snippetID = req.params.id
      const sessionUserName = req.session.userName

      const foundSnippet = (await Snippet.find({ _id: snippetID })).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name
      }))

      const viewData = {
        auth: true,
        userName: sessionUserName,
        snippetName: foundSnippet[0].name,
        snippetID: foundSnippet[0].id
      }

      res.render('crud-snippets/remove', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Removes a snippet from the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async snippetDelete (req, res, next) {
    try {
      const snippetID = req.params.id
      const _req = req
      const _res = res
      if (req.body.confirmBox === 'on') { // If confirm box is checked.
        await Snippet.deleteOne({ _id: snippetID }, (err, res) => {
          if (err) {
            const error = new Error('Internal Server Error')
            error.status = 500
            next(error)
          } else if (res) {
            if (res.deletedCount === 0) {
              console.log(err)
              _req.session.flash = { type: 'flashError', message: 'Could not remove snippet' }
              _res.redirect('./remove')
            } else if (res.deletedCount === 1) {
              _req.session.flash = { type: 'flashSuccess', message: 'The snippet has been removed successfully.' }
              _res.redirect('/crud/snippets')
            } else {
              const error = new Error('Internal Server Error')
              error.status = 500
              next(error)
            }
          }
        })
      } else {
        req.session.flash = { type: 'flashError', message: 'Removal not confirmed!' }
        res.redirect('./remove')
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }
}
