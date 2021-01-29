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

        viewData.snippets = (await Snippet.find({})).map(Snippet => ({
          id: Snippet._id,
          name: Snippet.name,
          createdAt: moment(Snippet.createdAt).fromNow(),
          modifiedAt: moment(Snippet.updatedAt).fromNow()
        }))
        console.log(viewData)

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
        snippet: snippetData
      })

      await newSnippet.save() // Sparar snippet i mongo

      req.session.flash = { type: 'flashSuccess', message: 'Your snippet has been created!' }
      return res.redirect('/crud/snippets') // startsidan
    } catch (err) {
      console.log(err) // fixa för anv sen!
    }

    }

}