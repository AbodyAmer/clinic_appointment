const mongoose = require('../config/mongoose')
const v4 = require('uuid')

const adminSchema = new mongoose.Schema({
  id: { type: String, default: v4.v4 },
  username: { type: String, unique: true },
  password: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('User', adminSchema)
