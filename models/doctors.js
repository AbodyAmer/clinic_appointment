const mongoose = require('../config/mongoose')
const v4 = require('uuid')

const doctorSchema = new mongoose.Schema({
  id: { type: String, default: v4.v4 },
  name: { type: String },
  price: { type: Number },
  clinicId: String,
  setSpecialty: String
}, { timestamps: true })

module.exports = mongoose.model('Doctors', doctorSchema)
