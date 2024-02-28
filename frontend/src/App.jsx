import {useState} from "react"

import SockJS from "sockjs-client"
import Stomp from "stompjs"
import axios from "axios"

import "./index.css"
import ChatArea from "./components/ChatArea"

import { Box, Button, TextField, Typography } from "@mui/material"

function App() {
  const [user, setUser] = useState({
    nickName: "",
    fullName: "",
    status: "ONLINE"
  })
  const [stompClient, setStompClient] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState(null)
  const urlBase = "http://localhost:8088"

  const handleConnection = (e) => {
      e.preventDefault()
      let socket = new SockJS(`${urlBase}/ws`)
      const client = Stomp.over(socket)
      client.connect({}, onConnected, onError)
      setStompClient(client)
  }

  const handleChange = async (e) => {
      await setUser({
          ...user,
          [e.target.name]: e.target.value
      })
  }

  const onConnected = () => {
      stompClient.subscribe(`/user/${user.nickName}/queue/messages`, onMessageReceived)
      stompClient.subscribe(`/user/public`, onMessageReceived)
      
      setUser({
          ...user,
          nickName: user.nickName.trim()
      })

      stompClient.send(
          '/app/user.addUser',
          {},
          JSON.stringify(user)
      )
      findConnectedUsers()
  }

  const findConnectedUsers = async () => {
      await axios.get(`${urlBase}/users`)
      .then(res => {
          setConnectedUsers(res.data.filter(userConnected => userConnected.nickName != user.nickName))
      })
      .catch(err => console.log(err))
  }

  const onError = () => {
      
  }

  const onMessageReceived = () => {

  }
  return (
    <Box
        height={'100vh'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'} 
    >
        {connectedUsers != null ? 
        
        <ChatArea 
            connectedUsers={connectedUsers} 
            adminUser={user}
            stompClient={stompClient}
        />
        : 
        
        <Box
            id="register-container"
            height={'80vh'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            padding={'2rem'}
            width={'100%'}
        >
            <Typography
                typography={'h3'}
                fontSize={'2.1rem'}
                marginBottom={'1.7rem'}
                color={"rgba(0, 0, 80)"}
                position={'relative'}
                sx={{
                    ":before": {
                        content: '""',
                        position: 'absolute',
                        bottom: '-.25rem',
                        left: '21%',
                        width: '220px',
                        height: '1px',
                        background: 'rgba(0, 0, 200, .2)'
                    }
                }}
            >Register and enter chat!</Typography>
            <Box 
                onSubmit={handleConnection}
                component={'form'}
                padding={'2rem 4rem'}
                display={'flex'}
                flexDirection={'column'}
                rowGap={'1.2rem'}
                height={'270px'}
                boxShadow={'0px 0px 3px 0px rgba(0, 0, 120)'}
                borderRadius={'10px'}
            >
                <TextField
                    label="NickName"
                    type="text" 
                    name="nickName"
                    onChange={handleChange}
                ></TextField>
                <TextField 
                    type="text" 
                    name="fullName"
                    label="Full Name"
                    onChange={handleChange}
                ></TextField>

                <Button
                    type="submit"
                    sx={{
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 120)',
                        borderRadius: '7px',
                        ":hover": {
                            background: 'rgba(0, 0, 120, .8)'
                        }
                    }}
                >Enter chatroom</Button>
            </Box>
        </Box>
        }
    </Box>
  )
}

export default App
