/* eslint-disable react/prop-types */
import { useState } from "react"

import { Box, List, ListItem, Typography } from "@mui/material"
import Icon from "react-icons-kit"
import {exit} from 'react-icons-kit/icomoon/exit'
import {androidSend} from 'react-icons-kit/ionicons/androidSend'
import {plusRound} from 'react-icons-kit/ionicons/plusRound'
import axios from "axios"
const ChatArea = ({connectedUsers, adminUser}) => {
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChatMessages, setSelectedChatMessages] = useState([])
    const urlBase = "http://localhost:8088"

    const sendMessage = (e) => {
        e.preventDefault()
    }

    const selectUserItem = (e) => {
        setSelectedUser(e.target.textContent)
        findSelectedChat()
    }

    const findSelectedChat = async () => {
        await axios.get(`${urlBase}/messages/${adminUser.nickName}/${selectedUser}`)
        .then(res => setSelectedChatMessages(res.data))
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
                    padding={'1rem 1.5rem 1.5rem 1.5rem'}
                    borderRadius={'25px'}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    sx={{
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 20px 0px rgba(0,0, 200, .2)'
                    }}
                >
                    <Box>
                        <Typography 
                            typography={'h5'}
                            fontSize={'1.3rem'}
                            marginBottom={'.7rem'}
                        >
                            One to one chat application
                        </Typography>
                        <Typography typography={'p'} marginBottom={'.5rem'}>
                            Users online: {connectedUsers.length}
                        </Typography>
                        <List
                            className="users-list"
                            sx={{
                                height:'300px',
                                marginBottom: '.8rem',
                                overflow: 'scroll',
                                padding: '0',
                            }}
                        >
                            {connectedUsers.map(user => {
                                return (
                                    <ListItem 
                                        key={user.nickName}
                                        sx={{
                                            cursor: 'pointer',
                                            padding: '.5rem .2rem',
                                            borderBottom: '1px solid rgba(0,0, 250, .15)',
                                            transition: '.4s',
                                            ":hover": {
                                                borderBottom: '1px solid rgba(0,0, 200, .75)'
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                background: 'rgba(0,0, 120,  .9)',
                                                color: '#fff',
                                                width: '34px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '.85rem',
                                                borderRadius: '50%',
                                                textTransform: 'uppercase',
                                                marginRight: '.7rem'
                                            }}
                                        >{`${user.nickName.charAt(0)}${user.nickName.charAt(1)}`}</Typography>
                                        <Typography 
                                            onClick={selectUserItem}
                                            typography={'p'}
                                        >{user.nickName}</Typography>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>

                    <button className="logout-button">
                        Log out <Icon className="logout-icon" icon={exit} size={14}></Icon>
                    </button>
                </Box>
                <Box
                    width={'70%'}
                    height={'95%'}
                >
                    <Box
                        id="chat-container"
                        height={'90%'}
                        padding={'2rem 1rem .8rem 1rem'}
                        display={'flex'}
                        flexDirection={'column'}
                        rowGap={'.5rem'}
                        overflow={'scroll'}
                    >
                        <Typography className="message-container sender-message">Hi! What`s going on?</Typography>
                        <Typography className="message-container recipient-message">Hi! I`m fine, work hard and break the pussy of your mom, you?</Typography>
                        <Typography className="message-container recipient-message">Yeah, sure. I`m studying databases and IA.</Typography>
                        <Typography className="message-container sender-message">Let`s go!</Typography>
                        <Typography className="message-container sender-message">Congratulations boy.</Typography>
                        <Typography className="message-container sender-message">Hi! What`s going on?</Typography>
                        <Typography className="message-container recipient-message">Hi! I`m fine, work hard and break the pussy of your mom, you?</Typography>
                        <Typography className="message-container recipient-message">Yeah, sure. I`m studying databases and IA.</Typography>
                        <Typography className="message-container recipient-message">Let`s go!</Typography>
                        <Typography className="message-container recipient-message">Congratulations boy.</Typography>
                        <Typography className="message-container sender-message">Hi! What`s going on?</Typography>
                        {selectedUser ? 
                            <Box>
                                {selectedChatMessages.map(message => {
                                    return (
                                        <p className={message.senderId == adminUser.nickName ? 'message-container sender-message' : 'message-container recipient-message'} key={message.id}>{message.content}</p>
                                    )
                                    })
                                }
                            </Box>
                            : 
                            null
                            /*<Typography 
                                typography={'p'} 
                                textAlign={'center'}
                                paddingTop={'2rem'}
                                fontSize={'1.6rem'}
                                color={'rgba(0,0, 90)'}
                            >Select a new chat!</Typography>*/
                        }
                    </Box>
                    <Box 
                        onSubmit={sendMessage}
                        component={'form'}
                        display={'flex'}
                        columnGap={'.9rem'}
                        alignItems={'center'}
                        marginTop={'1.2rem'}
                        position={'relative'}
                    >
                    <Icon className="file-icon" icon={plusRound} size={20}></Icon>    
                    <input className="message-input" placeholder="Enter your message here.."></input>
                    <button type="submit" className="send-button">
                        <Icon icon={androidSend} size={19}></Icon>
                    </button>
                </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ChatArea