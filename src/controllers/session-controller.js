/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'

// TA BORT! tillfälliga "konton"
const users = [// ANVÄND DATABAS!
  {username: 'oliwer', password: '$2b$08$Q.ffeqQzJxd35cLdyWX/ReOZuEV/8gdEwAibDIU4hYhzJi1tWnNOi'},
  {username: 'anv2', password: 'dsdsdsd' },
  {username: 'anv3', password: 'adsaadadaddad' }
]

let createdPass

export class SessionController {
  loginPage (req, res, next) {
      res.render('account/login')
  }

  async postLogin (req, res, next) {
      const username = req.body.username
      const password = req.body.password

      console.log('Username: ', username)
      console.log('Password: ', password)


      if (username && password !== undefined) {
        /*console.log('----bcrypt test----')
        console.log(await bcrypt.compare(password, createdPass))
        console.log('----bcrypt test----')*/

          const thisUser = users.find(thisUser => thisUser.username === username)
          console.log(thisUser)
          if (thisUser !== undefined) {
            var passwordCheck = await bcrypt.compare(password, thisUser.password)
          }


      }
      if (passwordCheck === true) {
        req.session.userId = req.session.id // var innan:  thisUser.id  // är req.session.id pålitligt sätt?
        req.session.flash = { type: 'flashSuccess', message: 'Login successful!' }
        return res.redirect('/')
      }

      req.session.flash = { type: 'flashError', message: 'Login Failed!' }
      res.redirect('/session/login')
  }

  logout (req, res, next) {
    req.session.destroy(e => {
      if (e !== undefined) {

        req.session.flash = { type: 'flashError', message: 'Could not log out. Please try again!' }

        return res.redirect('/') // FIXA statuskod om något blir fel!
      }
    })
      //req.session.flash = { type: 'flashSuccess', message: 'You are logged out!' }
      res.redirect('/') // redirect här? isf går inte viewdata att skicka!
  }

  registerPage (req, res, next) {
    res.render('account/register')
  }

  async registerAccount (req, res, next) {
    const username = req.body.username
    const password = req.body.password //await bcrypt.hash(req.body.password, 8) // byt till bcrypt sen!

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
        password: await bcrypt.hash(password, 8)
      }

      users.push(newUser) // Byt till mongoDB här!!

      req.session.userId = newUser.id

      console.log(users)

      req.session.flash = { type: 'flashSuccess', message: 'Your account has been created!' }
      return res.redirect('/') // startsidan
    } else {
      req.session.flash = { type: 'flashError', message: 'Choose another username.' }
      return res.redirect('./register')
    }


  }
}