/**
 * Mongoose snippet model.
 */

import mongoose from 'mongoose'

// schema

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
  versionKey: false
})

export const Snippet = mongoose.model('Snippet', schema)
