import React, { useEffect, useState } from 'react'
import styles from '../../styles/Home.module.css'
import Sidebar from './SideBar'
import { Flex, Box, Button, FormControl, FormLabel, Select, Input, Text } from '@chakra-ui/react'
import axios from 'axios'
import specialist from '../../config/specialistList'
import cogoToast from 'cogo-toast'

const Doctors = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [clinics, setClinics] = useState([])
  const [doctorName, setDoctorName] = useState('')
  const [doctorPrice, setDoctorPrice] = useState(0)
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedSpecialty, setSpecialty] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    (async () => {
      const res = await axios.get('/getclinics')
      console.log(res)
      setClinics(res.data.clinics)
      const ress = await axios.get('/getDoctors')
      setDoctors(ress.data.doctors)
    })()
  }, [])

  const addDoctor = async () => {
    const laoder = cogoToast.loading('Add a new doctor', { hideAfter: 0 })
    try {
      if (!doctorName || !doctorPrice || !selectedClinic || !selectedSpecialty || !username || !password) {
        await laoder.hide()
        cogoToast.error('Please add all the details')
        return
      }
      await axios.post('/addDoctor', {
        doctorName,
        doctorPrice,
        selectedClinic,
        selectedSpecialty,
        username,
        password
      })
      await laoder.hide()
      cogoToast.success('Success')
    } catch (error) {
      console.log(error)
      await laoder.hide()
      if (error.response) {
        cogoToast.error(error.response.data.message)
      } else {
        cogoToast.error('Error')
      }
    }
  }
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
                <Text fontSize='larger' fontWeight='bold'>Doctors</Text>
              </Box>
              <Box>
                {!showAddDoctor ? (
                  <Button type='button' bg='#017581' color='#fff' onClick={() => setShowAddDoctor(true)}>New Doctor</Button>
                ) : (
                  <Button type='button' colorScheme='red' onClick={() => setShowAddDoctor(false)}>Cancel</Button>
                )}
              </Box>
            </Flex>
            <Box>
              {!showAddDoctor ? (
                <Box>
                  <Box mt={4}>
                    {doctors.map(doctor => (
                      <Box key={doctor.id} p={4} mb={4} bg='#fff' border='1px solid #eee' borderRadius={3}>
                        <Flex>
                          <Box w='90%'>
                            <Text as='span' display='inline-block' fontWeight='bold'>Name:  </Text><Text as='span' display='inline-block'> {doctor.name}</Text>
                            <br />
                            <Text as='span' display='inline-block' fontWeight='bold'>Clinic:  </Text><Text as='span' display='inline-block'> {doctor.clinic.name}</Text>
                            <br />
                            <Text as='span' display='inline-block' fontWeight='bold'>Price per session:  </Text><Text as='span' display='inline-block'> RM {doctor.price}</Text>
                            <br />
                            <Text as='span' display='inline-block' fontWeight='bold'>Specialty:  </Text><Text as='span' display='inline-block'> {doctor.setSpecialty}</Text>
                          </Box>
                          <Box>
                            <Button as='a' href={`/dashboard/update_doctor?id=${doctor.id}`} size='sm' mt={2}>UPDATE</Button>
                          </Box>
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Doctor Name</FormLabel>
                    <Input bg='#fff' type='text' onChange={(e) => setDoctorName(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Price per session (RM)</FormLabel>
                    <Input bg='#fff' type='number' onChange={(e) => setDoctorPrice(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>clinic</FormLabel>
                    <Select bg='#fff' onChange={(e) => setSelectedClinic(e.target.value)}>
                      <option value=''>Select clinic</option>
                      {clinics.map(c => (
                        <option value={c.id} key={c.name}>{c.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Specialty</FormLabel>
                    <Select bg='#fff' onChange={(e) => setSpecialty(e.target.value)}>
                      <option value=''>Select Specialty</option>
                      {specialist.map(c => (
                        <option value={c.id} key={c.id}>{c.label}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>username</FormLabel>
                    <Input bg='#fff' onChange={(e) => setUsername(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Passowrd</FormLabel>
                    <Input bg='#fff' onChange={(e) => setPassword(e.target.value)} />
                  </FormControl>
                  <Box mt={2}>
                    <Button bg='#017581' color='#fff' onClick={addDoctor}>Submit</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Flex>
    </div>
  )
}

export default Doctors
