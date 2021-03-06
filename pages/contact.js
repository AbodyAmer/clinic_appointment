import React, { useState, useEffect } from 'react'
import {
  Box, Button, Input,
  FormControl,
  FormLabel,
  Textarea

} from '@chakra-ui/react'
import cogoToast from 'cogo-toast'
import axios from 'axios'

const contact = () => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const sendEmail = async () => {
    if (!email || !subject || !message) {
      cogoToast.error('Fill all requirements')
      return
    }
    axios.post('/conact', {
      email, subject, message
    })
    cogoToast.success('Thank you. We received your message')
  }
  return (
    <Box bg='#d7e4f4' minH='100vh' px='20'>
      <Box pt={12} />
      <Box>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input bgColor='#fff' type='email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <Input bgColor='#fff' type='text' placeholder='Subject' onChange={(e) => setSubject(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>message</FormLabel>
          <Textarea bgColor='#fff' placeholder='Messgae' onChange={(e) => setMessage(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <Button colorScheme='blue' onClick={sendEmail}>Send</Button>
      </Box>
    </Box>
  )
}

export default contact
