import { Box, Typography } from "@mui/material"
import Icon from "react-icons-kit"
import {exit} from 'react-icons-kit/icomoon/exit'
const ChatArea = () => {

    const sendMessage = (e) => {
        e.preventDefault()
    }

    return (
        <Box
            height={'100vh'}
            display={'flex'}
            alignItems={'center'}
            columnGap={'1rem'}
            justifyContent={'center'}
            sx={{
                backgroundColor: 'rgba(0, 110, 0)'
            }}
        >   
            <Box
                width={'20%'}
                height={'85%'}
                padding={'1rem 1.2rem 1.2rem 1.2rem'}
                borderRadius={'5px'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: '0px 0px 6px 0px rgba(255,255,255, .4)'
                }}
            >
                <Box>
                    <Typography 
                        typography={'h5'}
                        fontSize={'1.4rem'}
                        textAlign={'center'}
                        marginBottom={'.7rem'}
                    >
                        One to one chat application
                    </Typography>
                    <Typography typography={'p'}>
                        Users online: 1
                    </Typography>
                </Box>

                <button className="logout-button">
                    Log out <Icon className="logout-icon" icon={exit} size={14}></Icon>
                </button>
            </Box>
            <Box
                width={'60%'}
                height={'85%'}
                borderRadius={'3px'}
                padding={'2.7rem'}
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: '0px 0px 6px 0px rgba(255,255,255, .6)'
                }}
            >
                <Box
                    border={'1.5px solid rgba(0,0,0, .3)'}
                    borderRadius={'4px'}
                    height={'90%'}
                >
                </Box>
                <Box 
                    onSubmit={sendMessage}
                    component={'form'}
                    display={'flex'}
                    columnGap={'.9rem'}
                    alignItems={'center'}
                    marginTop={'1.2rem'}
                >
                    <input className="message-input" placeholder="Enter your message here.."></input>
                    <button type="submit" className="send-button">Send</button>
                </Box>
            </Box>
        </Box>
    )
}

export default ChatArea