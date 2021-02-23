import React from 'react'
import { Box, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const router = useRouter()
  return (
    <Box bg='#017581' minH='100vh'>
      <nav>
        <Link display='block' color='#d5f5f6' px={8} py={4} href={router.asPath}>
          Appointments
        </Link>
        <Link display='block' color='#d5f5f6' px={8} py={4} href='/logout'>
          Logout
        </Link>
      </nav>
    </Box>
  )
}

export default Sidebar
