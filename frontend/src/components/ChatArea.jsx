/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {useEffect, useState} from "react"

import SockJS from "sockjs-client"
import Stomp from "stompjs"
import axios from "axios"

import { Box, List, ListItem, Typography } from "@mui/material"
import Icon from "react-icons-kit"
import {logOut} from 'react-icons-kit/ionicons/logOut'
import {androidSend} from 'react-icons-kit/ionicons/androidSend'
import {plusRound} from 'react-icons-kit/ionicons/plusRound'
import {iosSearchStrong} from 'react-icons-kit/ionicons/iosSearchStrong'

const ChatArea = ({user}) => {
    const urlBase = "http://localhost:8088"
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChatMessages, setSelectedChatMessages] = useState([])
    const [message, setMessage] = useState("")
    const messageInput = document.querySelector('.message-input')
    const chat = document.getElementById('chat-container')
    const [stompClient, setStompClient] = useState(null)

    useEffect(() => {
        if(user){
            const socket = new SockJS(`${urlBase}/ws`)
            let client = Stomp.over(socket)

            const onReceivedMessage = (payload) => {
                if(payload){
                    const receivedMessage = JSON.parse(payload.body)
                    if(selectedUser){
                        if(!selectedChatMessages.includes(receivedMessage)){
                            setSelectedChatMessages((prevMessages) =>  [...prevMessages, receivedMessage])  
                        }
                        findSelectedChat()
                    }
                }
            }

            if(client){
                client.connect({}, () => {
                    client.subscribe(`/user/${user.nickName}/queue/messages`, onReceivedMessage)
                    client.subscribe(`/user/topic`, onReceivedMessage)
    
                    client.send(
                        '/app/user.addUser',
                        {},
                        JSON.stringify(user)
                    )
                    
                    setStompClient(client)
                    findUsers()
    
                    return () => {
                        client.disconnect();
                    };
                }, (err) => console.log(err))
            }
        }
        
    },[])

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

    const selectUserItem = (e) => {
        setSelectedUser(e.target.textContent)
        if(selectedUser){
            findSelectedChat()
            chat.scrollTop = chat.scrollHeight
        }
    }

    const findSelectedChat = async () => {
        await axios.get(`${urlBase}/messages/${user.nickName}/${selectedUser}`)
        .then(res => {
            setSelectedChatMessages(res.data) 
        })
    }
    
    const sendMessage = (e) => {
        e.preventDefault()
        
        setMessage("")
        messageInput.value = ""
        if(user && message){
            const chatMessage = {
                senderId: user.nickName,
                recipientId: selectedUser,
                content: message.trim(),
                timestamp: new Date()
            }
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage))
            findSelectedChat()
            chat.scrollTop = chat.scrollHeight
        }
    }

    const onLogout = () => {
        if(stompClient){
            stompClient.send(
                "/app/user.disconnectUser",
                {},
                JSON.stringify({nickName: user.nickName, fullName: user.fullName, status: 'OFFLINE'})
            )
            window.location.reload()
        }
    }

    return (
        <Box
            height={'95vh'}
            width={'80%'}
            display={'flex'}
            alignItems={'center'}
            borderRadius={'25px'}
            justifyContent={'center'}
            sx={{
                backgroundColor: 'rgba(0,0, 110,  .9)'
            }}
        >   
            <Box
                width={'97%'}
                height={'95%'}
                borderRadius={'25px'}
                padding={'1rem'}
                display={'flex'}
                columnGap={'1.7rem'}
                sx={{
                    backgroundColor: 'rgb(240, 240, 254)'
                }}
            >
                <Box
                    width={'30%'}
                    height={'100%'}
                    padding={'.8rem 1.5rem 1.5rem 1.5rem'}
                    borderRadius={'25px'}
                    display={'flex'}
                    flexDirection={'column'}
                    sx={{
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 20px 0px rgba(0,0, 200, .2)'
                    }}
                >
                    <Box>
                        <Typography 
                            typography={'h5'}
                            fontSize={'1.2rem'}
                        >
                            Chat application
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                height: '1px',
                                background: 'rgba(0,0, 250, .2)',
                                margin: '.35rem 0'
                            }}
                        ></Box>
                        <Box
                            component={'form'}
                            position={'relative'}
                            display={'flex'}
                            alignItems={'center'}
                        >
                            <input type="text" placeholder="Search.." className="search-input" />
                            <Icon className="search-icon" icon={iosSearchStrong} size={19}></Icon>
                        </Box>
                        <List
                            className="users-list"
                            sx={{
                                height:'300px',
                                marginBottom: '1.3rem',
                                overflow: 'scroll',
                                padding: '.3rem .2rem',
                            }}
                        >
                            {users.map(user => {
                                return (
                                    <ListItem 
                                        key={user.nickName}
                                        sx={{
                                            cursor: 'pointer',
                                            padding: '.4.5rem 1rem',
                                            borderBottomRightRadius: '20px',
                                            borderTopLeftRadius: '20px',
                                            marginBottom: '.8rem',
                                            boxShadow: '0px 0px 3.5px -1px rgba(0,0, 250, .5)',
                                            transition: '.4s',
                                            ":hover": {
                                                boxShadow: '0px 0px 4.5px -1px rgba(0,0, 250)',  
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                background: 'rgba(0,0, 120,  .9)',
                                                color: '#fff',
                                                width: '35px',
                                                height: '35px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '.85rem',
                                                borderRadius: '50%',
                                                textTransform: 'uppercase',
                                                marginRight: '.7rem'
                                            }}
                                        >{`${user.nickName.charAt(0)}${user.nickName.charAt(1)}`}</Typography>
                                        <Box
                                            display={'flex'}
                                            flexDirection={'column'}
                                        >
                                            <Typography 
                                                onClick={selectUserItem}
                                                typography={'p'}
                                                fontSize={'.9rem'}
                                            >{user.nickName}</Typography>
                                            <Box
                                                display={'flex'}
                                                columnGap={'.3rem'}
                                                alignItems={'center'}
                                            >
                                                <Box
                                                    width={'6px'}
                                                    height={'6px'}
                                                    borderRadius={'50%'}
                                                    
                                                    sx={{
                                                        backgroundColor: `${user.status === 'ONLINE' ? 'rgb(0, 170, 0)' : 'rgba(0,0,0, .5)'}`
                                                    }}
                                                ></Box>
                                                <Typography 
                                                    typography={'p'}
                                                    fontSize={'.8rem'} 
                                                    color={'rgba(0,0,0, .7)'}
                                                    textTransform={'lowercase'}   
                                                >
                                                    {user.status}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>

                    <button
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Log out <Icon className="logout-icon" icon={logOut} size={16}></Icon>
                    </button>
                </Box>
                <Box
                    width={'70%'}
                    height={'95%'}
                >
                    <Box
                        height={'90%'}
                        padding={'1rem 1.5rem 0 1rem'}
                    >
                        {selectedUser !== null ? 
                            <Box
                                id="chat-container"
                                ref={chat}
                                display={'flex'}
                                width={'100%'}
                                height={'100%'}
                                flexDirection={'column'}
                                padding={'1rem 0 .7rem 1rem'}
                                rowGap={'.7rem'}
                                overflow={'scroll'}
                            >
                            {selectedChatMessages.map(message => {
                                const timestamp = new Date(message.timestamp)
                                const messageHour = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                return (
                                   <Box 
                                        key={message.id} 
                                        className={message.senderId == user.nickName ? 'message-container sender-message' : 'message-container recipient-message'}
                                    >
                                        <Typography 
                                            typography={'p'}
                                            fontSize={'1.05rem'}
                                            marginBottom={'.2rem'}
                                            height={'auto'}
                                            display={'flex'}
                                            sx={{
                                                overflowWrap: 'anywhere'
                                            }}
                                        >
                                            {message.content}
                                            
                                        </Typography>
                                        <Typography 
                                            typography={'p'}
                                            fontSize={'.8rem'}
                                            textAlign={'right'}
                                            color={message.senderId == user.nickName ? 'rgba(255,255,255, .7)' : 'rgba(0,0,0, .6)'}
                                        >
                                            {messageHour}
                                        </Typography>
                                   </Box>
                                )
                                })
                            }
                            </Box>
                            : 
                            
                            <Typography 
                                typography={'p'} 
                                textAlign={'center'}
                                paddingTop={'2rem'}
                                fontSize={'1.6rem'}
                                color={'rgba(0,0, 90)'}
                            >No chat selected.</Typography>
                        }
                    </Box>
                    {selectedUser ?   
                        <Box 
                            id="message-form"
                            onSubmit={sendMessage}
                            component={'form'}
                            display={'flex'}
                            columnGap={'.9rem'}
                            alignItems={'center'}
                            marginTop={'1.2rem'}
                            position={'relative'}
                        >
                            <Icon className="file-icon" icon={plusRound} size={20}></Icon>    
                            <input 
                                ref={messageInput}
                                className="message-input" 
                                placeholder="Enter your message here.."
                                onChange={e => setMessage(e.target.value)}
                            ></input>
                            <button type="submit" className="send-button">
                                <Icon icon={androidSend} size={19}></Icon>
                            </button>
                        </Box>
                        : 
                        null
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default ChatArea