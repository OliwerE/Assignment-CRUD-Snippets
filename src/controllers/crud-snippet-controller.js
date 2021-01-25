/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class CrudSnippetController {
    index (req, res, next) {
        res.render('crud-snippets/index')
    }
}