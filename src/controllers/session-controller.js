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
    if (!req.session.userName) { // If user is logged in
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
    if (req.session.userName) { // If user is logged out
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

      if (username.length === 0 || password.length === 0) { // If the username and/or password is empty
        console.log('i if!')
        req.session.flash = { type: 'flashError', message: 'Please enter both fields' }
        return res.redirect('/session/login')
      }

      if (username && password !== undefined) {
        const thisUser = await User.find({ username: username }) // Finds user in the database.
        if (thisUser.length === 1) {
          const passwordCheck = await bcrypt.compare(password, thisUser[0].password)
          if (passwordCheck === true) {
            req.session.userName = username
            req.session.flash = { type: 'flashSuccess', message: 'Login successful!' }
            return res.redirect('/')
          }
        }

        // If the user is not found
        req.session.flash = { type: 'flashError', message: 'Login Failed! (401)' }
        return res.redirect('/session/login')
      } else {
        const error = new Error('Internal Server Error')
        error.status = 500
        next(error)
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
      await req.session.destroy() // Removes session from session storage
      res.redirect('/')
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
      const password = req.body.password

      let uniqueUsernameCheck
      if (username && password !== undefined) {
        const nameCheck = await User.find({ username: username })

        if (nameCheck.length === 0) { // If username is unique
          uniqueUsernameCheck = true
        } else {
          uniqueUsernameCheck = false
        }
      }

      if (uniqueUsernameCheck === true) {
        const newUser = new User({
          username: username,
          password: await bcrypt.hash(password, 8) // Encrypts username
        })

        await newUser.save()

        req.session.userName = username

        req.session.flash = { type: 'flashSuccess', message: 'Your account has been created!' }
        return res.redirect('/')
      } else { // If username is taken.
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
