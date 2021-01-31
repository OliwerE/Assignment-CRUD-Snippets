/**
 * Module represents the crud snippet controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'
import { User } from '../models/user-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class SessionController {
  /**
   * Used to verify if a user is logged in.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Returns data to next function.
   */
  activeSessionCheck (req, res, next) {
    if (!req.session.userName) {
      const error = new Error('Not Found')
      error.status = 404
      return next(error)
    } else {
      next()
    }
  }

  /**
   * Used to verify if a user is logged out.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Returns data to next function.
   */
  inactiveSessionCheck (req, res, next) {
    if (req.session.userName) {
      const error = new Error('Not Found')
      error.status = 404
      return next(error)
    } else {
      next()
    }
  }

  /**
   * Responds the user with a login page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  loginPage (req, res, next) {
    try {
      res.render('account/login')
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Used to login a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - Redirects the user to the home or login page.
   */
  async postLogin (req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password

      console.log('Username: ', username)
      console.log('Password: ', password)

      if (username && password !== undefined) {
        /* console.log('----bcrypt test----')
        console.log(await bcrypt.compare(password, createdPass))
        console.log('----bcrypt test----') */

        // const query = {}

        const thisUser = await User.find({ username: username }) // User.find( =thisUser> thisUser.username === username) // hittar anv i databasen!
        // console.log(thisUser[0].password) // skapa krash använd för att fixa int serv err!
        if (thisUser.length === 1) {
          const passwordCheck = await bcrypt.compare(password, thisUser[0].password)
          console.log(passwordCheck)
          if (passwordCheck === true) {
            // req.session.userId = req.session.id // var innan:  thisUser.id  // är req.session.id pålitligt sätt? OBS FEL! Se längre ner skapa konto är userid!
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

  /**
   * Logs out a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async logout (req, res, next) {
    try {
      await req.session.destroy(/* e => { // Något fel här.. behövs inte?
      if (e !== undefined) {
        console.log(e)
        req.session.flash = { type: 'flashError', message: 'Could not log out. Please try again!' }

        return res.redirect('/') // FIXA statuskod om något blir fel!
      }
    } */)
      // req.session.flash = { type: 'flashSuccess', message: 'You are logged out!' }
      res.redirect('/') // redirect här? isf går inte viewdata att skicka!
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Responds with a register account page to the user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  registerPage (req, res, next) {
    try {
      res.render('account/register')
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Used when a user registers a new account.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {Function} - A redirect response.
   */
  async registerAccount (req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password // await bcrypt.hash(req.body.password, 8) // byt till bcrypt sen!

      console.log('Username: ', username)
      console.log('Password: ', password)

      let uniqueUsernameCheck
      if (username && password !== undefined) {
        const nameCheck = await User.find({ username: username })

        if (nameCheck.length === 0) {
          uniqueUsernameCheck = true
        } else {
          uniqueUsernameCheck = false
        }
      }

      if (uniqueUsernameCheck === true) { // Om användarnamnet inte existerar
        console.log('Does not exist!')

        // skapar ny anv:
        /* const newUser = {
        id: users.length + 1,
        username: username,
        password: await bcrypt.hash(password, 8)
      } */

        const newUser = new User({
          username: username,
          password: await bcrypt.hash(password, 8)
        })

        await newUser.save() // sparar i mongodb!

        // users.push(newUser) // Byt till mongoDB här!!

        // req.session.userId = req.session.id // OK göra såhär??
        req.session.userName = username

        // console.log(users)

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
