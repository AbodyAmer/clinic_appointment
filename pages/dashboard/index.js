import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Sidebar from './SideBar'
import { Flex, Box } from '@chakra-ui/react'

export default function Dashboard ({ admin }) {
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
          Hello
        </Box>
      </Flex>
    </div>
  )
}
