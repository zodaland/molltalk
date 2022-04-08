import React, { useState, useContext } from 'react'
import { WebSocketContext } from '../library/WebSocketProvider';
import { roomState } from '../modules/chat';
import { userState } from '../modules/user';
import { useRecoilValue } from 'recoil';

const TextInputBox = () => {
    const [message, setMessage] = useState('')
    const { user } = useRecoilValue(userState);
    const roomNo = useRecoilValue(roomState);
    const wsService = useContext(WebSocketContext)

    const handleChangeText = (e) => {
        setMessage(e.target.value)
    }

    const handleClickSubmit = () => {
        if (message.trim() === '' || !wsService) return;

        wsService.chat(message);
        setMessage('');
    }

    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleClickSubmit()
        }
    }

    return (
        <div className="flex m-2">
            <input
                className="flex-grow border border-black rounded-md p-2 text-lg"
                type="text"
                value={message}
                onChange={handleChangeText}
                onKeyUp={handleKeyUp}
            />
            <button
                className="rounded-md bg-blue-100 py-2 px-4 ml-3 text-lg"
                type="button"
                onClick={handleClickSubmit}
            >
                Send
            </button>
        </div>
    )
}

export default TextInputBox