const send = require('gmail-send')

const sendEmail = async (email, name, date, clinicName, location, doctor) => {
  return send({
    user: 'onlineclinicconsultantsystem@gmail.com',
    pass: 'nrcqvlgdkonvwzza',
    to: email,
    subject: 'Doctor Appointment',
    html: `

      <div>Hi ${name},</div>
<p>
Your doctor appointment booking is confirmed,
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

module.exports = sendEmail
