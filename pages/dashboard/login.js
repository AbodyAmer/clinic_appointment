import React, { useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { Box, Stack, FormControl, FormLabel, Input, Button, Container, Center } from '@chakra-ui/react'

export default function Dashboard () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard Login</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Container centerContent>
          <Box minW='xl' py={8} px={2} borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Stack>
              <FormControl id='email' isRequired>
                <FormLabel>Username</FormLabel>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button as='a' href={`/login?username=${username}&password=${password}`} colorScheme='blue' size='md'>
              Login
              </Button>
            </Stack>
          </Box>
        </Container>
      </main>
    </div>
  )
}
