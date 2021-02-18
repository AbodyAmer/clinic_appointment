const mongoose = require('../config/mongoose')
const v4 = require('uuid')

const adminSchema = new mongoose.Schema({
  id: { type: String },
  phone: { type: String },
  name: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Patient', adminSchema)
