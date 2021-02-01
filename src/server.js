/**
 * Server configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'

/**
 * Function represents an Express web server configuration.
 */
const startApplication = async () => {
  const application = express()

  await connectDB(application) // connects to mongoDB and configures session options

  const fullDirName = dirname(fileURLToPath(import.meta.url))

  application.use(helmet()) // Security http headers

  application.use(logger('dev'))

  application.engine('hbs', hbs.express4({
    defaultLayout: join(fullDirName, 'views', 'layouts', 'default'),
    partialsDir: join(fullDirName, 'views', 'partials')
  }))
  application.set('view engine', 'hbs')
  application.set('views', join(fullDirName, 'views'))
  application.use(express.urlencoded({ extended: false }))
  application.use(express.static(join(fullDirName, '..', 'public')))

  // Session options configured in ./config/mongoose.js

  // Removes flash message after one response
  application.use((req, res, next) => {
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    next()
  })

  application.use('/', router)

  application.use((err, req, res, next) => {
    if (err.status === 403) {
      return res.status(403).sendFile(join(fullDirName, 'views', 'errors', '403.html'))
    }

    if (err.status === 404) {
      return res.status(404).sendFile(join(fullDirName, 'views', 'errors', '404.html'))
    }

    if (err.status === 500) {
      return res.status(500).sendFile(join(fullDirName, 'views', 'errors', '500.html'))
    }
  })

  application.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}

startApplication()
