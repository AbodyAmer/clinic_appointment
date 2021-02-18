const mongoose = require('../config/mongoose')
const v4 = require('uuid')

const clinicSchema = new mongoose.Schema({
  id: { type: String, default: v4.v4 },
  name: { type: String },
  address: { type: String },
  state: String,
  city: String,
  insurance: [String]
}, { timestamps: true })

module.exports = mongoose.model('Clinic', clinicSchema)
