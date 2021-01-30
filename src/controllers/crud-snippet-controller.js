/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'

import { Snippet } from '../models/snippet-model.js'
import moment from 'moment'

// TA BORT! tillfälliga "konton"
/*const users = [// ANVÄND DATABAS!
    { id: 1, username: 'anv1', password: 'secret' },
    { id: 2, username: 'anv2', password: 'dsdsdsd' },
    { id: 3, username: 'anv3', password: 'adsaadadaddad' }
]*/

export class CrudSnippetController {
  sessionAuthorize (req, res, next) {
      if (!req.session.userId) {
        const error = new Error('Not Found')
          error.status = 404
          return next(error)
      } else {
          next()
      }
  }

  async snippetAuthorizeChanges (req, res, next) {
    const snippetID = req.params.id
      const sessionUserName = req.session.userName

      const foundSnippet = await Snippet.find({_id: snippetID})

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
  }

    index (req, res, next) {
        //console.log(req.headers.cookie)

        if (req.session.userId !== undefined) {
            const viewData = {
                auth: true,
                userName: req.session.userName
            }
            res.render('crud-snippets/index', { viewData })
        } else {
            res.render('crud-snippets/index')
        }

        //console.log(req.session.id)
    }

    async showSnippetsList (req, res, next) {
        //console.log(users)
        var viewData = {}
        if (req.session.userId !== undefined) {
          viewData.auth = true
          viewData.userName = req.session.userName
        }

        const snippetsInStorage = (await Snippet.find({})).map(Snippet => ({
          id: Snippet._id,
          name: Snippet.name,
          createdAt: moment(Snippet.createdAt).fromNow(),
          modifiedAt: moment(Snippet.updatedAt).fromNow()
        }))
        //console.log(viewData)

        viewData.snippets = snippetsInStorage.reverse()

        res.render('crud-snippets/snippets', { viewData }) 
    }

    newSnippetGet (req, res, next) {
      if (req.session.userId !== undefined) {
          const viewData = {
              auth: true,
              userName: req.session.userName
          }
          res.render('crud-snippets/new', { viewData })
      } else {
          res.render('crud-snippets/new')
      }          
  }

  async newSnippetPost (req, res, next) {
  const snippetName = req.body.name
  const snippetData = req.body.snippet
  console.log('POST!')

  try {
    const newSnippet = new Snippet({
      name: snippetName,
      snippet: snippetData,
      owner: req.session.userName
    })

    await newSnippet.save() // Sparar snippet i mongo

    req.session.flash = { type: 'flashSuccess', message: 'Your snippet has been created!' }
    return res.redirect('/crud/snippets') // startsidan
  } catch (err) {
    console.log(err) // fixa för anv sen!
  }

  }

    async snippet (req, res, next) {
      const reqSnippet = req.params.id

      var viewData = {}
      if (req.session.userId !== undefined) {
        viewData.auth = true
        viewData.userName = req.session.userName
      }

      const foundSnippet = (await Snippet.find({_id: reqSnippet})).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        owner: Snippet.owner,
        snippet: Snippet.snippet,
        createdAt: moment(Snippet.createdAt).fromNow(),
        updatedAt: moment(Snippet.updatedAt).fromNow()
      }))

      viewData.snippet = foundSnippet[0]

      console.log(viewData.snippet)

      if (req.session.userName === foundSnippet[0].owner) {
        console.log('Äger snippet!')
        viewData.isOwner = 'true'
      }

      res.render('crud-Snippets/snippet', { viewData })


      // lägg till 404

    }

    async snippetEdit (req, res, next) {
      const snippetID = req.params.id

      const foundSnippet = (await Snippet.find({_id: snippetID})).map(Snippet => ({
        id: Snippet._id,
        name: Snippet.name,
        snippet: Snippet.snippet,
        //owner: Snippet.owner,
        //createdAt: moment(Snippet.createdAt).fromNow(),
        //updatedAt: moment(Snippet.updatedAt).fromNow()
      }))

      const viewData = {
        auth: true,
        userName: req.session.userName,
        snippet: foundSnippet[0]
      }
      console.log(viewData.snippet)

      return res.render('crud-snippets/edit', { viewData })
    }

    async snippetUpdate (req, res, next) {
      const snippetID = req.params.id
      const snippetName = req.body.name
      const snippetData = req.body.snippet

      console.log(snippetName, snippetData)

      return Snippet.updateOne({ _id: snippetID }, { name: snippetName, snippet: snippetData }, (err, res) => {
        if (err) {
          console.log('snippet update:  ', err)

          // flash msg här!
        }
        if (res) {
          console.log('snippet update:  ', res)

          // Flash msg och redirect till snippet här!
        }
      })
    }

    async snippetRemove (req, res, next) { // OBS mkt upprep från snippetEdit
    const snippetID = req.params.id
    const sessionUserName = req.session.userName

    const foundSnippet = (await Snippet.find({_id: snippetID})).map(Snippet => ({
      id: Snippet._id,
      name: Snippet.name,
    }))

    const viewData = {
      auth: true,
      userName: sessionUserName,
      snippetName: foundSnippet[0].name,
      snippetID: foundSnippet[0].id
    }

    //console.log(viewData)

    res.render('crud-snippets/remove', { viewData })
}

  async snippetDelete (req, res, next) { // OBS mkt upprep från snippetEdit
    const snippetID = req.params.id
    if (req.body.confirmBox === 'on') { // om confirm är vald
      //try { // kanske try över hela metoden??
        await Snippet.deleteOne({ _id: snippetID })
        req.session.flash = { type: 'flashSuccess', message: 'The snippet was removed successfully.' }
        res.redirect('/crud/snippets')
      /*} catch (err) {
        req.session.flash = { type: 'flashError', message: err.message } // ändra till hårdkodat felmeddelande??
        res.redirect('./remove')

      }*/
    }
  }
}
