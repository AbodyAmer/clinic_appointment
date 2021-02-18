import React, { useState, useEffect } from 'react'
import { Box, Flex, Progress, FormControl, FormLabel, Input, Select, Button } from '@chakra-ui/react'
import Sidebar from './SideBar'
import { useRouter } from 'next/router'
import axios from 'axios'
import specialist from '../../config/specialistList'
import cogoToast from 'cogo-toast'

const UpdateDoctor = () => {
  const [doctor, setDoctor] = useState(null)
  const [clinics, setClinics] = useState([])
  const [doctorName, setDoctorName] = useState('')
  const [doctorPrice, setDoctorPrice] = useState(0)
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedSpecialty, setSpecialty] = useState('')
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/getDoctor?doctorId=${router.query.id}`)
      console.log('res', res)
      setDoctor(res.data.doctor)
      if (res.data.doctor) {
        setDoctorName(res.data.doctor.name)
        setDoctorPrice(res.data.doctor.price)
        setSelectedClinic(res.data.doctor.clinicId)
        setSpecialty(res.data.doctor.setSpecialty)
      }
      const ress = await axios.get('/getclinics')
      console.log(ress)
      setClinics(ress.data.clinics)
    })()
  }, [router.query.id])

  const updateDoctor = async () => {
    const laoder = cogoToast.loading('Updating doctor', { hideAfter: 0 })
    try {
      if (!doctorName || !doctorPrice || !selectedClinic || !selectedSpecialty) {
        await laoder.hide()
        cogoToast.error('Please add all the details')
        return
      }
      await axios.post('/update_doctor', {
        id: doctor.id,
        doctorName,
        doctorPrice,
        selectedClinic,
        selectedSpecialty
      })
      await laoder.hide()
      cogoToast.success('Success')
    } catch (error) {
      await laoder.hide()
      cogoToast.error('error')
      console.log(error)
    }
  }
  return (
    <Box>
      <Flex w='100%'>
        <Box w='20%'>
          <Sidebar />
        </Box>
        <Box w='80%' bg='#f1f5f9' minH='100vh' px={6} py={4}>
          {!doctor ? (
            <Box>
              <Progress size='xs' isIndeterminate />
            </Box>
          ) : (
            <Box>
              <Box mb={2}>Update a doctor</Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Doctor Name</FormLabel>
                  <Input type='text' value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price per session (RM)</FormLabel>
                  <Input type='number' value={doctorPrice} onChange={(e) => setDoctorPrice(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>clinic</FormLabel>
                  <Select value={selectedClinic} onChange={(e) => setSelectedClinic(e.target.value)}>
                    <option value=''>Select clinic</option>
                    {clinics.map(c => (
                      <option value={c.id} key={c.name}>{c.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Specialty</FormLabel>
                  <Select value={selectedSpecialty} onChange={(e) => setSpecialty(e.target.value)}>
                    <option value=''>Select Specialty</option>
                    {specialist.map(c => (
                      <option value={c.id} key={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <Box mt={2}>
                  <Button colorScheme='yellow' onClick={updateDoctor}>Update</Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default UpdateDoctor
