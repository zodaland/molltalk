import React, { useState, useContext } from 'react'
import { WebSocketContext } from '../library/WebSocketProvider'
import { roomState } from '../modules/chat';
import { userState } from '../modules/user';
import { useRecoilValue } from 'recoil';

const TextInputBox = () => {
	const [message, setMessage] = useState('')
    const { user } = useRecoilValue(userState);
    const roomNo = useRecoilValue(roomState);
	const ws = useContext(WebSocketContext)

	const handleChangeText = (e) => {
		setMessage(e.target.value)
	}

	const handleClickSubmit = () => {
		if (message.trim() === '') {
			return
		}
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify({
				type: 'SEND',
				content: message,
			}))

			setMessage('')
            
		} else {
			alert('서버와 연결이 끊겼습니다.')
		}
	}
	
	const handleKeyUp = (e) => {
		if (e.keyCode === 13) {
			handleClickSubmit()
		}
	}

	return (
		<div>
			<input
				type="text"
				value={message}
				onChange={handleChangeText}
				onKeyUp={handleKeyUp}
			/>
			<button type="button" onClick={handleClickSubmit}>Send</button>
		</div>
	)
}

export default TextInputBox