import React, { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Box, Text, Stack, Button, Flex, Divider, WrapItem, Avatar, Wrap, Link } from '@chakra-ui/react'
import { BsSearch, BsCardText } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
import RSelect from 'react-select'
import malaysia from '../config/malaysia'
import specialist from '../config/specialistList'
import insurance from '../config/insurance'
import axios from 'axios'
import cogoToast from 'cogo-toast'

export default function Home () {
  const [stateOption, setStateOption] = useState(Object.keys(malaysia).map(key => ({ value: key, label: key })))
  const [special, setSpecial] = useState(specialist.map(s => ({ value: s.id, label: s.label })))
  const [slectedCondition, setSelectedCondition] = useState('')
  const [slectedState, setSelectedState] = useState('')
  const [slectedInsurance, setSelectedInsurance] = useState('')
  const [doctors, setDoctors] = useState([])
  const [clinics, setClinics] = useState([])

  const search = async () => {
    const loader = cogoToast.loading('Searching for doctors', { hideAfter: 0 })
    try {
      const res = await axios.post('/find_doctors', {
        slectedCondition,
        slectedState,
        slectedInsurance
      })

      console.log(res.data)
      setClinics(res.data.clinics)
      setDoctors(res.data.doctors)
      await loader.hide()
      if (res.data.doctors.length === 0) {
        cogoToast.error('No doctors found')
      }
    } catch (error) {
      await loader.hide()
      cogoToast.error('Error')
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Book a doctor</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Box bg='#fef14b' color='#00234b' py={4} px={20}>
          <Link mr={10} color='#00234b' href='/check_appointment'>
            Check your appointments
          </Link>
          <Link mr={10} color='#00234b' href='/contact'>
            Contact Us
          </Link>
        </Box>
        <Box bg='#d7e4f4' minH='100vh' px='20'>
          <Box pt={12}>
            <Text color='#00234b' fontSize='52px' fontWeight='bold' lineHeight='3.75rem'>Find local doctors <br /> who take your insurance</Text>
          </Box>
          <Flex>
            <Box width='90%' mt={4} py={3} px={4} bg='#fff'>
              <Stack isInline>
                <Box w='33%' pl={4}>
                  <Box position='relative'>
                    <BsSearch style={{ position: 'absolute', top: '10px', left: '-10px' }} />
                    <RSelect
                      // key={props.packages.lenght}
                      onChange={(e) => {
                        if (!e) {
                          setSelectedCondition('')
                        } else {
                          setSelectedCondition(e.value)
                        }
                      }}
                      className='basic-single'
                      placeholder='    Search for a condition'
                      classNamePrefix='select'
                      // defaultValue={props.packages.find(p => p.value === props.selectedPackage)}
                      isClearable
                      isSearchable
                      name='color'
                      options={special}
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? '#2962FF' : '#ffffff0f',
                          color: 'white'
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          color: 'white',
                          // borderColor: '#3B4143'
                          border: 'none'
                        }),
                        container: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          borderColor: '#3B4143',
                          color: 'white'
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          // backgroundColor: '#ffffff0f',
                          color: 'white'
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        input: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        menu: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#32383B',
                          color: 'white'
                        })
                      }}
                    />
                  </Box>

                </Box>
                <Box w='33%' pl={4}>
                  <Box position='relative'>
                    <ImLocation style={{ position: 'absolute', top: '10px', left: '-10px' }} />
                    <RSelect
                      // key={props.packages.lenght}
                      onChange={(e) => {
                        if (!e) {
                          setSelectedState('')
                        } else {
                          setSelectedState(e.value)
                        }
                      }}
                      className='basic-single'
                      placeholder='Select a state'
                      classNamePrefix='select'
                      // defaultValue={props.packages.find(p => p.value === props.selectedPackage)}
                      isClearable
                      isSearchable
                      name='color'
                      options={stateOption}
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? '#2962FF' : '#ffffff0f',
                          color: 'white'
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          color: 'white',
                          // borderColor: '#3B4143'
                          border: 'none'
                        }),
                        container: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          borderColor: '#3B4143',
                          color: 'white'
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          // backgroundColor: '#ffffff0f',
                          color: 'white'
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        input: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        menu: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#32383B',
                          color: 'white'
                        })
                      }}
                    />
                  </Box>
                </Box>
                <Box w='33%' pl={4}>
                  <Box position='relative'>
                    <BsCardText style={{ position: 'absolute', top: '10px', left: '-17px' }} />
                    <RSelect
                      // key={props.packages.lenght}
                      onChange={(e) => {
                        if (!e) {
                          setSelectedInsurance('')
                        } else {
                          setSelectedInsurance(e.value)
                        }
                      }}
                      className='basic-single'
                      placeholder='Search for an insurance'
                      classNamePrefix='select'
                      // defaultValue={props.packages.find(p => p.value === props.selectedPackage)}
                      isClearable
                      isSearchable
                      name='color'
                      options={insurance}
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? '#2962FF' : '#ffffff0f',
                          color: 'white'
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          color: 'white',
                          // borderColor: '#3B4143'
                          border: 'none'
                        }),
                        container: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#ffffff0f',
                          borderColor: '#3B4143',
                          color: 'white'
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          // backgroundColor: '#ffffff0f',
                          color: 'white'
                        }),
                        singleValue: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        input: (provided, state) => ({
                          ...provided,
                          color: 'black'
                        }),
                        menu: (provided, state) => ({
                          ...provided,
                          backgroundColor: '#32383B',
                          color: 'white'
                        })
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
            <Box width='10%' mt={4}>
              <Button onClick={search} borderRadius='0' py={3} height='100%' w='70%' bg='#fef14b'>
                <BsSearch />
              </Button>
            </Box>
          </Flex>
          {doctors.length > 0 && clinics.length > 0 && (
            <Box mt={8} bg='#fff' px={4} py={4}>
              <Text color='#00234b' fontSize='24px' fontWeight='bold'>{doctors.length} doctors found</Text>
              <Divider orientation='horizontal' />
              {doctors.map(d => (
                <Box p={4} key={d.id}>
                  <Flex>
                    <Box mr={4}>
                      <Wrap>
                        <WrapItem>
                          <Avatar name={d.name} src='https://bit.ly/tioluwani-kolawole' />
                        </WrapItem>
                      </Wrap>
                    </Box>
                    <Box w='90%'>
                      <Text color='#00234b' fontSize='18px' fontWeight='bold'>DR. {d.name}</Text>
                      <Text fontSize='14px'>{d.setSpecialty}</Text>
                      <Text fontSize='14px' color='gray.400'>{clinics.find(c => c.id === d.clinicId).name}, {clinics.find(c => c.id === d.clinicId).address}, {clinics.find(c => c.id === d.clinicId).city}, {clinics.find(c => c.id === d.clinicId).state}</Text>
                    </Box>
                    <Box>
                      <Button as='a' href={`/book_doctor?id=${d.id}`} bg='#00234b' color='#fff' size='sm' mt={4} ml={4}>Book</Button>
                    </Box>
                  </Flex>
                  <Divider mt={4} orientation='horizontal' />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </main>
    </div>
  )
}
