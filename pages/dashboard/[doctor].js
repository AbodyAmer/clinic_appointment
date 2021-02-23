import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Sidebar from './doctorSide'
import { Flex, Box, Spinner, Text, Badge, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router' 
import axios from 'axios'
import moment from 'moment'
import cogoToast from 'cogo-toast'

export default function Dashboard ({ admin }) {
  const router = useRouter()
  console.log(router)
  const [appointments, setAppointment] = useState([])
  const [doctor, setDoctor] = useState(null)
  useEffect(() => {
    (async () => {
      const re = await axios.get('/get_doctor_detail')
      setDoctor(re.data.doctor)
      const res = await axios.get('/get_doctor_appointments')
      console.log(res)
      setAppointment(res.data.appointments)
    })()
  }, [router.query.doctor])
  const cancel = async (id) => {
    const loader = cogoToast.loading('Cancelling an appointments', { hideAfter: 0 })
    try {
      const res = await axios.post('/cancel_appointment', { id })
      const apps = res.data.appointments.filter(a => a.doctorId === router.query.doctor )
      setAppointment(apps)
      await loader.hide()
    } catch (error) {
      await loader.hide()
      cogoToast.error('Error')
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex w='100%'>
        <Box w='20%'>
          <Sidebar />
        </Box>
        <Box w='80%' bg='#f1f5f9' minH='100vh'>
          {!doctor ? (
            <Box py={16} px={12}>
            <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          </Box>
          ) : (
            <Box py={16} px={12}>
              <Text fontSize='x-large'>
                Welcome {doctor.name}!
              </Text>
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
          )}
        </Box>
      </Flex>
    </div>
  )
}
