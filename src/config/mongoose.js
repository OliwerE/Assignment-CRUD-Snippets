/**
 * Mongoose configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

 import mongoose from 'mongoose'

 import session from 'express-session'
 import MongoStore from 'connect-mongo'

 export const connectDB = (application) => {
     mongoose.connection.on('connected', () => {
         console.log('Mongoose is connected.')
     })
     mongoose.connection.on('error', (error) => {
         console.log(`A mongoose connection error has occured: ${error}`)
     })
     mongoose.connection.on('disconnected', () => {
        console.log('Mongoose is disconnected.')
    })

    // om node stängs
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose is disconnected because of application termination.')
            process.exit(0)
        })
    })

    // anslutning till databasen
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    var mongoDBSessionStore = MongoStore(session)

    const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // en dag
      sameSite: 'lax'
    },
    store: new mongoDBSessionStore({ mongooseConnection: mongoose.connection })
  }

  if (application.get('env') === 'production') { // om i produktions server!
    application.set('trust proxy', 1) // lita på första proxyn
    sessionOptions.cookie.secure = true // kräv säkra kakor!
  }

  application.use(session(sessionOptions))
 }
