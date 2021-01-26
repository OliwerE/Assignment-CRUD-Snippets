/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class CrudSnippetController {
    index (req, res, next) {
        console.log(req.headers.cookie)
        res.render('crud-snippets/index')
    }

    showSnippetsList (req, res, next) {
        res.render('crud-snippets/snippets')        
    }

    newSnippet (req, res, next) {
        res.render('crud-snippets/new')        
    }

    loginPage (req, res, next) {
        res.render('account/login')
    }
}