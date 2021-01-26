/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

// TA BORT! tillfälliga "konton"
const users = [// ANVÄND DATABAS!
    { id: 1, username: 'anv1', password: 'secret' },
    { id: 2, username: 'anv2', password: 'dsdsdsd' },
    { id: 3, username: 'anv3', password: 'adsaadadaddad' }
]

export class CrudSnippetController {
    index (req, res, next) {
        //console.log(req.headers.cookie)
        res.render('crud-snippets/index')
    }

    showSnippetsList (req, res, next) {
        console.log(users)
        res.render('crud-snippets/snippets')        
    }

    newSnippet (req, res, next) {
        res.render('crud-snippets/new')        
    }

    loginPage (req, res, next) {
        res.render('account/login')
    }

    postLogin (req, res, next) {
        const username = req.body.username
        const password = req.body.password

        console.log('Username: ', username)
        console.log('Password: ', password)

        if (username && password !== undefined) {
            var thisUser = users.find(thisUser => thisUser.username === username && thisUser.password === password)
        }

        if (thisUser !== undefined) {
          req.session.userId = thisUser.id
          return res.redirect('/')
        }

        res.redirect('/login')
    }

    logout (req, res, next) {
      req.session.destroy(e => {
        if (e !== undefined) {

          // Flash message här!

          return res.redirect('/') // FIXA statuskod om något blir fel!
        }
        res.clearCookie(process.env.SESSION_NAME) // tar bort inaktiverade cookien
        
        
        // Flash message här!


        return res.redirect('/')
      })
    }

    registerPage (req, res, next) {
      res.render('account/register')
    }

    registerAccount (req, res, next) {
      const username = req.body.username
      const password = req.body.password

      console.log('Username: ', username)
      console.log('Password: ', password)

      if (username && password !== undefined) {
        var uniqueUsernameCheck = users.find(thisUser => thisUser.username === username)
      }

      if (!uniqueUsernameCheck) { // Om användarnamnet inte existerar
        console.log('Does not exist!')

        //skapar ny anv:
        const newUser = {
          id: users.length + 1,
          username: username,
          password: password
        }

        users.push(newUser) // Byt till mongoDB här!!

        req.session.userId = newUser.id

        console.log(users)

        return res.redirect('/') // startsidan
      }

      console.log('Does EXIST!')
    }
}