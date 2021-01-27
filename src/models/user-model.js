/**
 * Mongoose user model.
 */

 import mongoose from 'mongoose'

 // schema

 const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: [10, 'Password must be at least 10 characters.'],
    required: true
  }
  }, {
    timestamps: true,
    versionKey: false
})

export const User = mongoose.model('User', schema)