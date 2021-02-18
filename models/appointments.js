const mongoose = require('../config/mongoose')
const v4 = require('uuid')

const adminSchema = new mongoose.Schema({
  id: { type: String, default: v4.v4 },
  patientId: { type: String },
  doctorId: { type: String },
  time: { type: String },
  date: { type: Date },
  description: { type: String },
  status: { type: String, enum: ['PAID', 'PENDING', 'CANCELED'] }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', adminSchema)
