import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Sidebar from './SideBar'
import malaysia from '../../config/malaysia'
import insurance from '../../config/insurance'
import cogoToast from 'cogo-toast'
import { Flex, Box, Button, FormControl, FormLabel, Input, Select, Text } from '@chakra-ui/react'

export default function Dashboard (props) {
  const [showAddClinics, setShowAddClinics] = useState(false)
  const [states, setStates] = useState(Object.keys(malaysia).map(key => key))
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [clinics, setClinics] = useState([])

  useEffect(() => {
    (async () => {
      const res = await axios.get('/getclinics')
      console.log(res)
      setClinics(res.data.clinics)
    })()
  }, [])

  const addClinic = async () => {
    const laoder = cogoToast.loading('Add a new clinic', { hideAfter: 0 })
    try {
      if (!selectedState || !selectedCity || !address || !name) {
        await laoder.hide()
        cogoToast.error('Please add all the details')
        return
      }
      const res = await axios.post('/addclinic', {
        name: name,
        address: address,
        state: selectedState,
        city: selectedCity,
        insurance: []
      })
      await laoder.hide()
      cogoToast.success('Success')
    } catch (error) {
      console.log()
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
        <Box w='80%' bg='#f1f5f9' minH='100vh' px={6} py={4}>
          <Box w='80%' py='4' px='4'>
            <Flex justifyContent='space-between'>
              <Box>
                <Text fontSize='24px' fontWeight='bold'>
                Clinics
                </Text>
              </Box>
              <Box>
                {!showAddClinics ? (
                  <Button type='button' bg='#017581' color='#fff' onClick={() => setShowAddClinics(true)}>New Clinic</Button>
                ) : (
                  <Button type='button' colorScheme='red' onClick={() => setShowAddClinics(false)}>Cancel</Button>
                )}
              </Box>
            </Flex>
          </Box>
          <Box>
            {!showAddClinics ? (
              <Box>
                <Box>
                  {clinics.map(clinic => (
                    <Box key={clinic.id} p={4} mb={4} bg='#fff' border='1px solid #eee' borderRadius={3}>
                      <Text as='span' display='inline-block' fontWeight='bold'>Name: </Text><Text as='span' display='inline-block'>{clinic.name}</Text>
                      <br />
                      <Text as='span' display='inline-block' fontWeight='bold'>Address: </Text><Text>{clinic.address}, {clinic.city}, {clinic.state}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box>
                <FormControl id='email'>
                  <FormLabel>Clinic Name</FormLabel>
                  <Input bg='#fff' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl id='email'>
                  <FormLabel>Address</FormLabel>
                  <Input bg='#fff' value={address} type='text' onChange={(e) => setAddress(e.target.value)} />
                </FormControl>
                <FormControl id='country'>
                  <FormLabel>state</FormLabel>
                  <Select
                    bg='#fff'
                    placeholder='Select state' onChange={(e) => {
                      setSelectedState(e.target.value)
                      setSelectedCity('')
                    }}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </FormControl>
                {selectedState && (
                  <FormControl id='country'>
                    <FormLabel>City</FormLabel>
                    <Select bg='#fff' placeholder='Select city' onChange={(e) => setSelectedCity(e.target.value)}>
                      {malaysia[selectedState].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Box mt={2}>
                  <Button bg='#017581' color='#fff' type='button' onClick={addClinic}>Submit</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </div>
  )
}
