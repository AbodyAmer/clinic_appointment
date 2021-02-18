import React, { useEffect, useState } from 'react'
import styles from '../../styles/Home.module.css'
import Sidebar from './SideBar'
import { Flex, Box, Button, FormControl, FormLabel, Select, Input, Text, Badge } from '@chakra-ui/react'
import axios from 'axios'
import specialist from '../../config/specialistList'
import cogoToast from 'cogo-toast'
import moment from 'moment'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    (async () => {
      const res = await axios.get('/all_booking')
      setAppointments(res.data.appointments)
    })()
  }, [])

  const cancel = async (id) => {
    const loader = cogoToast.loading('Cancelling an appointments', { hideAfter: 0 })
    try {
      const res = await axios.post('/cancel_appointment', { id })
      setAppointments(res.data.appointments)
      await loader.hide()
    } catch (error) {
      await loader.hide()
      cogoToast.error('Error')
      console.log(error)
    }
  }

  console.log('appointments', appointments)
  return (
    <div className={styles.container}>
      <Flex w='100%'>
        <Box w='20%'>
          <Sidebar />
        </Box>
        <Box w='80%' bg='#f1f5f9' minH='100vh' px={6} py={4}>
          <Box w='80%' py='4' px='4'>
            <Flex justifyContent='space-between'>
              <Box>
                <Text fontSize='larger' fontWeight='bold'>Appointments</Text>
              </Box>
            </Flex>
            <Box mt={4}>
              {appointments.map(a => (
                <Box key={a.id} p={4} mb={4} bg='#fff' border='1px solid #eee' borderRadius={3}>
                  <Flex>
                    <Box w='90%'>
                      <Text as='span' display='inline-block' fontWeight='bold' mr={2}>Patient Name:  </Text><Text as='span' display='inline-block'>{a.patient.name}</Text>
                      <br />
                      <Text as='span' display='inline-block' fontWeight='bold' mr={2}>Clinic:  </Text><Text as='span' display='inline-block'> {a.clinic.name}</Text>
                      <br />
                      <Text as='span' display='inline-block' fontWeight='bold' mr={2}>Doctor  </Text><Text as='span' display='inline-block'> {a.doctor.name}</Text>
                      <br />
                      <Text as='span' display='inline-block' fontWeight='bold' mr={2}>Date:  </Text><Text as='span' display='inline-block'> {moment(a.date).format('ll').toString()} {a.time}</Text>
                    </Box>
                    <Box>
                      {moment().isBefore(moment(a.date), 'day') ? (
                        <Box>
                          {a.status !== 'CANCELED' ? (
                            <Box>
                              <Box>
                                <Badge colorScheme='green'>
                                  ACTIVE
                                </Badge>
                              </Box>
                              <Button colorScheme='red' size='xs' mt={2} onClick={() => cancel(a.id)}>Cancel</Button>
                            </Box>
                          ) : (
                            <Badge colorScheme='red'>
                            CANCELED
                            </Badge>
                          )}
                        </Box>
                      ) : (
                        <Badge colorScheme='red'>
                          {a.status !== 'CANCELED' ? (
                            'EXPIRED'
                          ) : (
                            'CANCELED'
                          )}
                        </Badge>
                      )}
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Flex>
    </div>
  )
}

export default Appointments
