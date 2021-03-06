const send = require('gmail-send')

const sendContact = async (email, subject, message) => {
  return send({
    user: 'onlineclinicconsultantsystem@gmail.com',
    pass: 'nrcqvlgdkonvwzza',
    to: 'onlineclinicconsultantsystem@gmail.com',
    subject: subject,
    html: `

      <div>Message from ${email},</div>
      <p>
      ${message}
      </p>
      `
  })().then(res => {
    console.log('res', res)
  }).catch(err => {
    console.log(err)
  })
}

module.exports = sendContact
