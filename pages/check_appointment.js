import React, { useState, useEffect } from 'react'
import {
  Box, Button, Input, Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Badge
} from '@chakra-ui/react'
import cogoToast from 'cogo-toast'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'

const CheckAppointment = () => {
  const router = useRouter()
  const [id, setId] = useState('')
  const [patient, setPatient] = useState('')
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        const res = await axios.get(`/my_booking?id=${router.query.id}`)
        if (!res.data.patient) {
          setPatient('')
          setAppointments([])
          return
        }
        setPatient(res.data.patient)
        setAppointments(res.data.appointments)
      }
    })()
  }, [router.query.id])
  const search = async () => {
    if (!id) {
      return
    }
    const loader = cogoToast.loading('Finding appoinemtns', { hideAfter: 0 })
    try {
      const res = await axios.get(`/my_booking?id=${id}`)
      if (!res.data.patient) {
        await loader.hide()
        cogoToast.info('No record')
        setPatient('')
        setAppointments([])
        return
      }
      setPatient(res.data.patient)
      setAppointments(res.data.appointments)
      await loader.hide()
    } catch (error) {
      console.log()
    }
  }
  console.log({ patient, appointments })
  return (
    <Box bg='#d7e4f4' minH='100vh' px='20'>
      <Box pt={12} />
      <Box width='50%' py={3}>
        <Input placeholder='Enter your ID / Passport mumber' bg='#fff' onChange={(e) => setId(e.target.value)} />
      </Box>
      <Box width='10%' mt={4}>
        <Button onClick={search} borderRadius='0' py={3} height='100%' w='70%' bg='#fef14b'>
          Search
        </Button>
      </Box>
      <Box mt={8}>
        {patient && (
          <Box bg='#fff' p={4}>
            <Box>
              <Text>Name: {patient.name}</Text>
              <Text>Phone: {patient.phone}</Text>
            </Box>
            <Box>
              {appointments.length > 0 && (
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Doctor</Th>
                      <Th>Clinic</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {appointments.map(app => (
                      <Tr key={app.id}>
                        <Td>{moment(app.date, 'YYYY-MM-DD').format('ll').toString()} {app.time}</Td>
                        <Td>{app.doctor.name}</Td>
                        <Td>{app.clinic.address}, {app.clinic.city}, {app.clinic.status}</Td>
                        <Td>
                          {moment(app.date, 'YYYY-MM-DD').isBefore(moment(), 'day') ? (
                            <Badge colorScheme='red'>Expired</Badge>
                          ) : (
                            <Badge colorScheme='green'>Active</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CheckAppointment
