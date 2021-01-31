/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'

import { User } from '../models/user-model.js'

// TA BORT! tillfälliga "konton"
/*const users = [// ANVÄND DATABAS!
  {username: 'oliwer', password: '$2b$08$Q.ffeqQzJxd35cLdyWX/ReOZuEV/8gdEwAibDIU4hYhzJi1tWnNOi'},
  {username: 'anv2', password: 'dsdsdsd' },
  {username: 'anv3', password: 'adsaadadaddad' }
]*/

let createdPass

export class SessionController {
  activeSessionCheck (req, res, next) {
    if (!req.session.userId) {
      const error = new Error('Not Found')
      error.status = 404
      return next(error)
    } else {
      next()
    }
  }

  inactiveSessionCheck (req, res, next) {
    if (req.session.userId) {
      const error = new Error('Not Found')
      error.status = 404
      return next(error)
    } else {
      next()
    }
  }

  loginPage (req, res, next) {
    try {
      res.render('account/login')
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }

  }

  async postLogin (req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password

      console.log('Username: ', username)
      console.log('Password: ', password)


      if (username && password !== undefined) {
        /*console.log('----bcrypt test----')
        console.log(await bcrypt.compare(password, createdPass))
        console.log('----bcrypt test----')*/

        //const query = {}

          const thisUser = await User.find({username: username}) // User.find( =thisUser> thisUser.username === username) // hittar anv i databasen!
          //console.log(thisUser[0].password) // skapa krash använd för att fixa int serv err!
          if (thisUser.length === 1) {
            var passwordCheck = await bcrypt.compare(password, thisUser[0].password)
            console.log(passwordCheck)
            if (passwordCheck === true) {
              req.session.userId = req.session.id // var innan:  thisUser.id  // är req.session.id pålitligt sätt? OBS FEL! Se längre ner skapa konto är userid!
              req.session.userName = username
              req.session.flash = { type: 'flashSuccess', message: 'Login successful!' }
              return res.redirect('/')
            }
          }
          
          // hittade mer än en användare eller användare saknas.
          req.session.flash = { type: 'flashError', message: 'Login Failed! (401)' }
          return res.redirect('/session/login')
      }
     } catch (err) {
        const error = new Error('Internal Server Error')
        error.status = 500
        next(error)
      }
  }

  async logout (req, res, next) {
    try{
     await req.session.destroy(/*e => { // Något fel här.. behövs inte?
      if (e !== undefined) {
        console.log(e)
        req.session.flash = { type: 'flashError', message: 'Could not log out. Please try again!' }

        return res.redirect('/') // FIXA statuskod om något blir fel!
      }
    }*/)
      //req.session.flash = { type: 'flashSuccess', message: 'You are logged out!' }
      res.redirect('/') // redirect här? isf går inte viewdata att skicka!
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  registerPage (req, res, next) {
    try{
      res.render('account/register')
  } catch (err) {
    const error = new Error('Internal Server Error')
    error.status = 500
    next(error)
  }
  }

  async registerAccount (req, res, next) {
    try{
    const username = req.body.username
    const password = req.body.password //await bcrypt.hash(req.body.password, 8) // byt till bcrypt sen!

    console.log('Username: ', username)
    console.log('Password: ', password)

    
    if (username && password !== undefined) {
      var nameCheck = await User.find({username: username})

      var uniqueUsernameCheck
      if (nameCheck.length === 0) {
        uniqueUsernameCheck = true
      } else {
        uniqueUsernameCheck = false
      }
    }

    if (uniqueUsernameCheck === true) { // Om användarnamnet inte existerar
      console.log('Does not exist!')

      //skapar ny anv:
      /*const newUser = {
        id: users.length + 1,
        username: username,
        password: await bcrypt.hash(password, 8)
      }*/

      const newUser = new User({
        username: username,
        password: await bcrypt.hash(password, 8)
      })

      await newUser.save() // sparar i mongodb!

      //users.push(newUser) // Byt till mongoDB här!!

      req.session.userId = req.session.id // OK göra såhär??
      req.session.userName = username

      //console.log(users)

      req.session.flash = { type: 'flashSuccess', message: 'Your account has been created!' }
      return res.redirect('/') // startsidan
    } else {
      req.session.flash = { type: 'flashError', message: 'Choose another username.' }
      return res.redirect('./register')
    }
  } catch (err) {
    const error = new Error('Internal Server Error')
    error.status = 500
    next(error)
  }
  }
}