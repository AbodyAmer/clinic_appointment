import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Box, Select, Wrap, WrapItem, Button, Avatar, Text, Divider, Progress, FormControl, Input, FormLabel, Textarea } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import moment from 'moment'
import cogoToast from 'cogo-toast'
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs'
import images from 'react-payment-inputs/images'

const times = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM']
const BookDoctor = () => {
  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps

  } = usePaymentInputs()
  const [appointments, setAppointments] = useState([])
  const [doctor, setDoctor] = useState('')
  const [name, setName] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState(times[0])
  const [timeList, setTimeList] = useState(times)
  const [description, setDescritpion] = useState('')
  const router = useRouter()

  const book = async () => {
    const loader = cogoToast.loading('Booking...', { hideAfter: 0 })
    try {
      if (!name || !customerId || !phone || !date || !time || !description) {
        await loader.hide()
        cogoToast.error('Please fill all requirement')
        return
      }
      await axios.post('/book_appointment', {
        name, customerId, phone, date, time, description, doctorId: router.query.id
      })
      await loader.hide()
      cogoToast.success('Success')
      router.push(`/check_appointment?id=${customerId}`)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    (async () => {
      if (router.query && router.query.id) {
        const res = await axios.get(`/doctor_appointments?id=${router.query.id}`)
        if (res.data.doctor) {
          setAppointments(res.data.appointments)
          setDoctor(res.data.doctor)
        }
      }
    })()
  }, [router.query.id])
  console.log({ doctor, appointments })
  return (
    <div className={styles.container}>
      <Head>
        <title>Book a doctor</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Box bg='#d7e4f4' minH='100vh' px='20'>
          <Box pt={12}>
            <Box mt={8} bg='#fff' px={4} py={4}>
              {!doctor ? (
                <Progress size='xs' isIndeterminate />
              ) : (
                <Box p={4} key={doctor.id}>
                  {/* <Flex> */}
                  <Box mr={4}>
                    <Wrap>
                      <WrapItem>
                        <Avatar name={doctor.name} src='https://bit.ly/tioluwani-kolawole' />
                      </WrapItem>
                    </Wrap>
                  </Box>
                  <Box w='90%'>
                    <Text color='#00234b' fontSize='18px' fontWeight='bold'>DR. {doctor.name}</Text>
                    <Text fontSize='14px'>{doctor.setSpecialty}</Text>
                    <Text fontSize='14px' color='gray.400'>{doctor.clinic.name}, {doctor.clinic.address}, {doctor.clinic.city}, {doctor.clinic.state}</Text>
                  </Box>
                  {/* </Flex> */}
                  <Divider mt={4} orientation='horizontal' />
                  <Box mt={8} p={4} bg='#f3f3f4' w='50%' border='1px solid #E1E1E4'>
                    <Text color='#00234b' fontSize='18px' fontWeight='bold'>
                    Book an appointment
                    </Text>
                    <Box mt={4}>
                      <FormControl>
                        <FormLabel>Your name</FormLabel>
                        <Input variant='outline' type='text' bg='#fff' onChange={(e) => setName(e.target.value)} />
                      </FormControl>
                    </Box>
                    <Box mt={2}>
                      <FormControl>
                        <FormLabel>Your ID number</FormLabel>
                        <Input variant='outline' type='text' bg='#fff' onChange={(e) => setCustomerId(e.target.value)} />
                      </FormControl>
                    </Box>
                    <Box mt={2}>
                      <FormControl>
                        <FormLabel>Phone number</FormLabel>
                        <Input variant='outline' type='text' bg='#fff' onChange={(e) => setPhone(e.target.value)} />
                      </FormControl>
                    </Box>
                    <Box mt={2}>
                      <FormControl>
                        <FormLabel>Date</FormLabel>
                        <Input
                          type='date' bg='#fff' min={moment().format('YYYY-MM-DD').toString()} onChange={(e) => {
                            appointments.map(app => {
                              console.log(moment(app.date))
                              console.log(moment(e))
                              if (moment(app.date).isSame(moment(e.target.value), 'day')) {
                                console.log('same')
                                const timess = timeList.filter(t => t !== app.time)
                                setTimeList(timess)
                              } else {
                                console.log('no same')
                                setTimeList(times)
                              }
                            })
                            setDate(moment(e.target.value).format('YYYY-MM-DD').toString())
                          }}
                        />
                      </FormControl>
                    </Box>
                    {date && (
                      <Box mt={2}>
                        <FormControl>
                          <FormLabel>Time</FormLabel>
                          <Select bg='#fff' onChange={(e) => setTime(e.target.value)}>
                            {timeList.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                    <Box mt={2}>
                      <FormControl>
                        <FormLabel>Condition description</FormLabel>
                        <Textarea variant='outline' bg='#fff' onChange={(e) => setDescritpion(e.target.value)} />
                      </FormControl>
                    </Box>
                    <Box>
                      <FormLabel>Deposit payment RM100</FormLabel>
                      <PaymentInputsWrapper {...wrapperProps}>
                        <svg {...getCardImageProps({ images })} />
                        <input {...getCardNumberProps()} />
                        <input {...getExpiryDateProps()} />
                        <input {...getCVCProps()} />
                      </PaymentInputsWrapper>
                    </Box>
                    <Box mt={2}>
                      <Button type='button' onClick={book} bg='#00234b' color='#fff' w='100%'>
                        Confirm
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </main>
    </div>
  )
}

export default BookDoctor
