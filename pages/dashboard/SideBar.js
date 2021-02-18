import React from 'react'
import { Box, Link } from '@chakra-ui/react'

const Sidebar = () => {
  return (
    <Box bg='#017581' minH='100vh'>
      <nav>
        <Link display='block' color='#d5f5f6' px={8} py={4} href='/dashboard/clinics'>
          Clinics
        </Link>
        <Link display='block' color='#d5f5f6' px={8} py={4} href='/dashboard/doctors'>
          Doctors
        </Link>
        <Link display='block' color='#d5f5f6' px={8} py={4} href='/dashboard/appointments'>
          Appointments
        </Link>
      </nav>
    </Box>
  )
}

export default Sidebar
