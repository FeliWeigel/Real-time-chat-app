import { useState } from "react"

import "./index.css"
import ChatArea from "./components/ChatArea"

import { Alert, Box, Button, TextField, Typography } from "@mui/material"

function App() {
    const [user, setUser] = useState({
        nickName: "",
        fullName: "",
        status: "ONLINE"
    })
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const handleChange = async (e) => {
        await setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleConnection = (e) => {
        e.preventDefault()
        if(user.fullName && user.nickName){
            setError(false)
            setUser({
                ...user,
                nickName: user.nickName.trim()
            })
            setSuccess(true)
        }else {
            setError(true)
        }
    }

    return (
        <Box
            height={'100vh'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
           {
            !error && !success ? 
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
                    {error && !success ? 
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
                : <ChatArea user={user}/>
           }
        </Box>
    )
}

export default App
