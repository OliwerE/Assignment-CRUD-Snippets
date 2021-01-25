/**
 * Server configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
import session from 'express-session'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'

const startApplication = async () => {
  await connectDB() // ansluter till databasen

  const application = express()
  const fullDirName = dirname(fileURLToPath(import.meta.url))

  application.use(helmet()) // extra säkerthet med http headers för bl.a xss!

  application.use(logger('dev')) // logg i dev format

  // engine config:
  application.engine('hbs', hbs.express4({
    defaultLayout: join(fullDirName, 'views', 'layouts', 'default'),
    partialsDir: join(fullDirName, 'views', 'partials')
  }))
  application.set('view engine', 'hbs')
  application.set('views', join(fullDirName, 'views'))

  application.use(express.urlencoded({ extended: false }))

  // statiska filer:
  application.use(express.static(join(fullDirName, '..', 'public')))

  // Session:

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // en dag
      sameSite: 'lax'
    }
  }

  if (application.get('env') === 'production') { // om i produktions server!
    application.set('trust proxy', 1) // lita på första proxyn
    sessionOptions.cookie.secure = true // kräv säkra kakor!
  }

  application.use(session(sessionOptions))

  // tar bort flash messages efter en gång
  application.use((req, res, next) => {
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    next()
  })

  application.use('/', router) // lägger till routes

  // Felhantering
  application.use((err, req, res, next) => {
    if (err.status === 404) {
      return res.status(404).sendFile(join(fullDirName, 'views', 'errors', '404.html'))
    }

    if (err.status === 500) {
      return res.status(500).sendFile(join(fullDirName, 'views', 'errors', '500.html'))
    }

    // dev only: ta bort sen!
    //res.status(err.status || 500).render('errors/error', { error: err })
  })

  application.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}

startApplication()
