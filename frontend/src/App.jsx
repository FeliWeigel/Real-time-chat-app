import {useState} from "react"

import SockJS from "sockjs-client"
import Stomp from "stompjs"
import axios from "axios"

import "./index.css"
import ChatArea from "./components/ChatArea"

import { Alert, Box, Button, TextField, Typography } from "@mui/material"

function App() {
    const [user, setUser] = useState({
        nickName: "",
        fullName: "",
        status: "ONLINE"
    })
    const [stompClient, setStompClient] = useState(null)
    const [users, setUsers] = useState(null)
    const [error, setError] = useState(false)
    const urlBase = "http://localhost:8088"

    const handleConnection = async (e) => {
        e.preventDefault()
        if(user.fullName && user.nickName && user.status){
            setError(false)
            const socket = await new SockJS(`${urlBase}/ws`)
            const client = Stomp.over(socket)
            setStompClient(client)
            client.connect({}, onConnected, onError)
        }else {
            setError(true)
        }
    }

    const handleChange = async (e) => {
        await setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const onConnected = () => {
        if(stompClient){
            stompClient.subscribe(`/user/${user.nickName}/queue/messages`)
            stompClient.subscribe(`/user/topic`)
            
            setUser({
                ...user,
                nickName: user.nickName.trim(),
                status: 'ONLINE'
            })

            setError(false)
            stompClient.send(
                '/app/user.addUser',
                {},
                JSON.stringify(user)
            )
            findUsers()
        }
    }

    const findUsers = async () => {
        await axios.get(`${urlBase}/users`)
        .then(res => {
            const onlineUsers = (res.data.filter(userFiltered => userFiltered.status === 'ONLINE' && userFiltered.nickName != user.nickName))
            const offlineUsers = (res.data.filter(userFiltered => userFiltered.status === 'OFFLINE' && userFiltered.nickName != user.nickName))
            const allUsers = onlineUsers.concat(offlineUsers)
            setUsers(allUsers)
        })
        .catch(err => console.log(err))
    }

    const onError = () => {
        setError(true)
    }

    return (
        <Box
            height={'100vh'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            {users != null ? 
            
            <ChatArea 
                usersList={users} 
                adminUser={user}
                stompClient={stompClient}
            />
            : 
            
            <Box
                id="register-container"
                height={'85vh'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                padding={'2rem'}
                width={'100%'}
            >
                <Typography
                    typography={'h3'}
                    fontSize={'2.1rem'}
                    marginBottom={'2rem'}
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
                {error ? 
                    <Alert 
                        severity="error" 
                        sx={{
                            marginTop: '.5rem',
                            boxShadow: '0px 0px 4px 0px rgba(180,0,0, .5)',
                            background: 'rgba(90, 0,0)',
                            color: 'rgba(250,110,110)',
                            borderRadius: '10px'
                    }}>The fields cannot be null!</Alert> 
                    : 
                    null
                }
            </Box>
            }
        </Box>
    )
}

export default App
