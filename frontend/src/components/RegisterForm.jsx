import {useState} from "react"
import "../index.css"
import { Box, Button, TextField, Typography } from "@mui/material"
import SockJS from "sockjs-client"
import Stomp from "stompjs"
import axios from "axios"

const RegisterForm = () => {
    const [nickName, setNickName] = useState("")
    const [fullName, setFullName] = useState("")
    const [stompClient, setStompClient] = useState(null)
    const [connectedUsers, setConnectedUsers] = useState([])

    const handleConnection = (e) => {
        e.preventDefault()
        const socket = new SockJS("http://localhost:8081/ws")
        const client = Stomp.over(socket)
        client.connect({}, onConnected, onError)
        setStompClient(client)
    }

    const onConnected = () => {
        stompClient.subscribe(`/user/${nickName}/queue/messages`, onMessageReceived)
        stompClient.subscribe(`/user/public`, onMessageReceived)
        
        //register the connected user
        stompClient.send(
            '/app/user.addUser',
            {},
            JSON.stringify({nickName: nickName, fullName: fullName, status: 'ONLINE'})
        )

        findConnectedUsers()
    }

    const findConnectedUsers = async () => {
        await axios.get("/users", {withCredentials: true})
        .then(res => {
            setConnectedUsers(res.data.filter(userConnected => userConnected.nickName !== nickName))
            console.log(res.data)
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
            <Box
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
                    color={"rgba(0, 70, 0, .9)"}
                    position={'relative'}
                    sx={{
                        ":before": {
                            content: '""',
                            position: 'absolute',
                            bottom: '-.25rem',
                            left: '21%',
                            width: '220px',
                            height: '1px',
                            background: 'rgba(0, 180, 0, .2)'
                        }
                    }}
                >Register new user to chat!</Typography>
                <Box 
                    onSubmit={handleConnection}
                    component={'form'}
                    padding={'2rem 4rem'}
                    display={'flex'}
                    flexDirection={'column'}
                    rowGap={'1.2rem'}
                    height={'270px'}
                    boxShadow={'0px 0px 3px 0px rgba(0, 175, 0)'}
                >
                    <TextField 
                        id="text-field"
                        label="NickName"
                        type="text" 
                        name="nickName"
                        onChange={(e) => setNickName(e.target.value)}
                    ></TextField>
                    <TextField 
                        type="text" 
                        name="fullName"
                        label="Full Name"
                        onChange={(e) => setFullName(e.target.value)}
                    ></TextField>

                    <Button
                        type="submit"
                        sx={{
                            color: '#fff',
                            background: 'rgba(0, 175, 0, .9)',
                            border: '1px solid rgba(0, 175, 0, .9)',
                            ":hover": {
                                background: 'rgba(0, 175, 0, .7)'
                            }
                        }}
                    >Enter chatroom</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default RegisterForm