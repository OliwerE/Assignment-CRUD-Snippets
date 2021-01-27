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
        res.render('crud-snippets/index')
        console.log(req.session.id)
    }

    showSnippetsList (req, res, next) {
        //console.log(users)
        res.render('crud-snippets/snippets')        
    }

    newSnippet (req, res, next) {
        res.render('crud-snippets/new')        
    }

}