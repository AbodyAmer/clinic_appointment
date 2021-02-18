require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const next = require('next')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const Admin = require('./models/admin')
const Clinics = require('./models/clinic')
const Doctor = require('./models/doctors')
const Patient = require('./models/patient')
const Appointment = require('./models/appointments')
const moment = require('moment')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(compression())
  server.use(cookieParser())
  server.use(bodyParser.json({ limit: '50mb' }))
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  server.get('/add', (req, res) => {
    const a = new Admin({
      username: 'admin',
      password: crypto
        .createHmac('sha256', process.env.hashingSecret) // encrypted password
        .update('1234')
        .digest('hex')
    })
    a.save()
    return app.render(req, res, '/', req.query)
  })
  server.get('/a', (req, res) => {
    return app.render(req, res, '/', req.query)
  })

  server.get('/getclinics', async (req, res) => {
    try {
      const clinics = await Clinics.find({}).lean()
      res.json({ clinics: clinics.sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()) })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })

  server.get('/all_booking', async (req, res) => {
    try {
      const appointments = await Appointment.find().lean()
      const app = await Promise.all(appointments.map(async a => {
        a.doctor = await Doctor.findOne({ id: a.doctorId }).lean()
        a.clinic = await Clinics.findOne({ id: a.doctor ? a.doctor.clinicId : '' }).lean()
        a.patient = await Patient.findOne({ id: a.patientId }).lean()
        return a
      }))
      res.json({ appointments: app.sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()) })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.get('/my_booking', async (req, res) => {
    try {
      const { id } = req.query
      const patient = await Patient.findOne({ id }).lean()
      if (!patient) {
        return res.json({ messgae: 'No record' })
      }
      const appointments = await Appointment.find({ patientId: id }).lean()
      if (appointments.length === 0) {
        return res.json({ messgae: 'No record' })
      }
      const apps = await Promise.all(appointments.map(async app => {
        app.doctor = await Doctor.findOne({ id: app.doctorId }).lean()
        app.clinic = await Clinics.findOne({ id: app.doctor ? app.doctor.clinicId : '' }).lean()
        return app
      }))

      res.json({ appointments: apps, patient })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })

  server.post('/cancel_appointment', async (req, res) => {
    try {
      const { id } = req.body
      const a = await Appointment.updateOne({ id }, { $set: { status: 'CANCELED' } })
      const appointments = await Appointment.find().lean()
      const app = await Promise.all(appointments.map(async a => {
        a.doctor = await Doctor.findOne({ id: a.doctorId }).lean()
        a.clinic = await Clinics.findOne({ id: a.doctor ? a.doctor.clinicId : '' }).lean()
        a.patient = await Patient.findOne({ id: a.patientId }).lean()
        return a
      }))
      res.json({ appointments: app.sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()) })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.get('/getDoctors', async (req, res) => {
    try {
      const doctors = await Doctor.find({}).lean()
      const docs = await Promise.all(doctors.map(async doctor => {
        doctor.clinic = await Clinics.findOne({ id: doctor.clinicId }).lean()
        return doctor
      }))
      res.json({ doctors: docs.sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()) })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.get('/getDoctor', async (req, res) => {
    try {
      const { doctorId } = req.query
      const doctor = await Doctor.findOne({ id: doctorId }).lean()
      return res.json({ doctor })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })

  server.post('/find_doctors', async (req, res) => {
    try {
      const { slectedInsurance, slectedState, slectedCondition } = req.body

      const queryClinic = {
        // ...(slectedInsurance && ({ insurance: slectedInsurance })),
        ...(slectedState && ({ state: slectedState }))
      }

      const clinics = await Clinics.find(queryClinic).lean()
      const id = clinics.map(c => c.id)
      const doctors = await Doctor.find({ clinicId: { $in: id }, ...(slectedCondition && ({ setSpecialty: slectedCondition })) }).lean()
      res.json({ clinics, doctors })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })

  server.post('/book_appointment', async (req, res) => {
    try {
      const { name, customerId, phone, date, time, description, doctorId } = req.body
      const cus = await Patient.findOne({ id: customerId }).lean()
      if (!cus) {
        const user = new Patient({
          id: customerId,
          phone,
          name
        })
        await user.save()
      } else {
        Patient.updateOne({ id: customerId }, { $set: { phone } })
      }

      const app = new Appointment({
        patientId: customerId,
        doctorId,
        time,
        date,
        description,
        status: 'PENDING'
      })
      await app.save()
      res.end()
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.get('/doctor_appointments', async (req, res) => {
    try {
      const { id } = req.query
      const doctor = await Doctor.findOne({ id }).lean()
      doctor.clinic = await Clinics.findOne({ id: doctor.clinicId }).lean()
      const appointments = await Appointment.find({ doctorId: id }).lean()
      res.json({ doctor, appointments })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.post('/update_doctor', async (req, res) => {
    try {
      const { id, doctorName, doctorPrice, selectedClinic, selectedSpecialty } = req.body
      await Doctor.updateOne({ id },
        {
          $set: {
            name: doctorName,
            price: Number(doctorPrice),
            clinicId: selectedClinic,
            setSpecialty: selectedSpecialty
          }
        })
      res.json({ message: 'SUCCESS' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.post('/addDoctor', async (req, res) => {
    try {
      const { doctorName, doctorPrice, selectedClinic, selectedSpecialty } = req.body
      const a = new Doctor({
        name: doctorName,
        price: Number(doctorPrice),
        clinicId: selectedClinic,
        setSpecialty: selectedSpecialty
      })
      await a.save()
      res.json({ message: 'OK' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message })
    }
  })
  server.post('/addClinic', async (req, res) => {
    try {
      const a = new Clinics({
        name: req.body.name,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        insurance: req.body.insurance || []
      })
      await a.save()
      res.json({ messgae: 'OK' })
    } catch (error) {
      res.status(401).json({ message: error.message })
    }
  })
  server.get('/login', async (req, res) => {
    try {
      const admin = await Admin.findOne({ username: req.query.username }).lean()
      if (admin && admin.password === crypto
        .createHmac('sha256', process.env.hashingSecret) // encrypted password
        .update(req.query.password)
        .digest('hex')) {
        const option = {
          httpOnly: true,
          secure: false,
          expires: new Date(Date.now() + 8640000000)
        }
        res.cookie('admin', req.query.username, option)
        res.redirect('/dashboard')
      } else {
        res.status(401).json({ message: 'Username or password is wrong' })
      }
    } catch (error) {
      res.status(500).end(error.message)
    }
  })

  server.get('/dashboard/login', (req, res) => {
    if (req.cookies.admin) {
      return res.redirect('/dashboard')
    }
    return app.render(req, res, '/dashboard/login', req.query)
  })
  server.get('/dashboard/clinics', async (req, res) => {
    try {
      if (!req.cookies.admin) {
        return res.redirect('/dashboard')
      }
      return app.render(req, res, '/dashboard/clinics', { ...req.query })
    } catch (error) {
      console.log(error)
      res.status(500).end(error.message)
    }
  })
  server.get('/dashboard/doctors', async (req, res) => {
    try {
      if (!req.cookies.admin) {
        return res.redirect('/dashboard')
      }
      return app.render(req, res, '/dashboard/doctors', { ...req.query })
    } catch (error) {
      console.log(error)
      res.status(500).end(error.message)
    }
  })

  server.get('/dashboard', (req, res) => {
    try {
      if (!req.cookies.admin) {
        return res.redirect('/dashboard/login')
      }
      return app.render(req, res, '/dashboard', req.query)
    } catch (error) {
      res.status(500).end(error.message)
    }
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
