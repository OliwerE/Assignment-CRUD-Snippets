/**
 * Mongoose configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

 import mongoose from 'mongoose'

 export const connectDB = () => {
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
    return mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
 }
