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
      if (!req.session.userName) {
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

      if (foundSnippet.length === 1) { // obs 404 för ej inloggade hanteras av sessionAuthorize som anropas innan denna metod!
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
      } else {
        const error = new Error('Internal Server Error')
        error.status = 500
        return next(error)
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
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
      // console.log(req.headers.cookie)

      if (req.session.userName !== undefined) {
        const viewData = {
          auth: true,
          userName: req.session.userName
        }
        res.render('crud-snippets/index', { viewData })
      } else {
        res.render('crud-snippets/index')
      }

      // console.log(req.session.id)
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async showSnippetsList (req, res, next) {
    try {
      // console.log(users)
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
      // console.log(viewData)

      viewData.snippets = snippetsInStorage.reverse()

      res.render('crud-snippets/snippets', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  newSnippetGet (req, res, next) {
    try {
      if (req.session.userName !== undefined) {
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
   * @param req
   * @param res
   * @param next
   */
  async newSnippetPost (req, res, next) {
    try {
      const snippetName = req.body.name
      const snippetData = req.body.snippet
      console.log('POST!')

      const newSnippet = new Snippet({
        name: snippetName,
        snippet: snippetData,
        owner: req.session.userName
      })

      await newSnippet.save() // Sparar snippet i mongo

      req.session.flash = { type: 'flashSuccess', message: 'Your snippet has been created!' }
      return res.redirect('/crud/snippets') // startsidan
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async snippet (req, res, next) {
    try {
      const reqSnippet = req.params.id

      const viewData = {}
      if (req.session.userName !== undefined) {
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

      // console.log(viewData.snippet)

      if (req.session.userName === foundSnippet[0].owner) {
        console.log('Äger snippet!')
        viewData.isOwner = 'true'
      }

      res.render('crud-Snippets/snippet', { viewData })

      // lägg till 404
    } catch {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async snippetEdit (req, res, next) {
    try {
      const snippetID = req.params.id

      const foundSnippet = (await Snippet.find({ _id: snippetID })).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        snippet: Snippet.snippet
        // owner: Snippet.owner,
        // createdAt: moment(Snippet.createdAt).fromNow(),
        // updatedAt: moment(Snippet.updatedAt).fromNow()
      }))

      const viewData = {
        auth: true,
        userName: req.session.userName,
        snippet: foundSnippet[0]
      }
      console.log(viewData.snippet)

      return res.render('crud-snippets/edit', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async snippetUpdate (req, res, next) {
    try {
      const snippetID = req.params.id
      const snippetName = req.body.name
      const snippetData = req.body.snippet

      console.log(snippetName, snippetData)

      const _res = res
      const _req = req
      return Snippet.updateOne({ _id: snippetID }, { name: snippetName, snippet: snippetData }, (err, res) => {
        if (err) {
          const error = new Error('Internal Server Error')
          error.status = 500
          return next(error)
        }
        if (res) {
          if (res.n === 0) {
            _req.session.flash = { type: 'flashError', message: 'Internal Server Error. (500)' }
            _res.redirect('./edit')
          } else if (res.n === 1) {
            _req.session.flash = { type: 'flashSuccess', message: 'The snippet has been updated successfully.' }
            _res.redirect('./')
          } else {
            const error = new Error('Internal Server Error')
            error.status = 500
            return next(error)
          }
        }
      })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async snippetRemove (req, res, next) { // OBS mkt upprep från snippetEdit
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

      // console.log(viewData)

      res.render('crud-snippets/remove', { viewData })
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  async snippetDelete (req, res, next) { // OBS mkt upprep från snippetEdit
    try {
      const snippetID = req.params.id
      if (req.body.confirmBox === 'on') { // om confirm är vald
      // try { // kanske try över hela metoden??
        await Snippet.deleteOne({ _id: snippetID })
        req.session.flash = { type: 'flashSuccess', message: 'The snippet has been removed successfully.' }
        res.redirect('/crud/snippets')
      /* } catch (err) {
        req.session.flash = { type: 'flashError', message: err.message } // ändra till hårdkodat felmeddelande??
        res.redirect('./remove')

      } */
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }
}
