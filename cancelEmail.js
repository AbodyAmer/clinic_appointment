const send = require('gmail-send')

const cancelEmail = async (email, name, date, clinicName, location, doctor) => {
  return send({
    user: 'onlineclinicconsultantsystem@gmail.com',
    pass: 'nrcqvlgdkonvwzza',
    to: email,
    subject: 'Doctor Appointment Cancelation',
    html: `

      <div>Hi ${name},</div>
<p>
  We are sorry to inform you that your doctor appointment has been <strong>CANCELED</strong>,
</p>

<ul>
  <li>
  Clinic: ${clinicName}
  </li>
  <li>
  Location: ${location}
  </li>
  <li>
  Doctor: ${doctor}
  </li>
  <li>
    Date: ${date}
  </li>
</ul>
<p>
Thank you,
</p>
      `
  })().then(res => {
    console.log('res', res)
  }).catch(err => {
    console.log(err)
  })
}

module.exports = cancelEmail
