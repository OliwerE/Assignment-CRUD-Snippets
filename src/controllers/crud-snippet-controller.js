/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'

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

    showSnippetsList (req, res, next) {
        //console.log(users)
        if (req.session.userId !== undefined) {
            const viewData = {
                auth: true,
                userName: req.session.userName
            }
            res.render('crud-snippets/snippets', { viewData })
        } else {
            res.render('crud-snippets/snippets')
        }     
    }

    newSnippet (req, res, next) {
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

}