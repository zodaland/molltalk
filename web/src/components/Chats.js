import React, { useState, useEffect, useRef, useContext } from 'react'
import { WebSocketContext } from '../library/WebSocketProvider'
import { chatState, itemState } from '../modules/chat'

import { roomState } from '../modules/room';
import { userState } from '../modules/user';
import { useRecoilState, useRecoilValue } from 'recoil'

const Chats = () => {
	const [items, setItems] = useRecoilState(chatState)
    const { user } = useRecoilValue(userState);
    const item = useRecoilValue(itemState);
	//dom 접근 ref 사용
	let boxRef = useRef(null)

	let style = {
		width: '350px',
		height: '200px',
		fontSize: '12px',
		overflowY: 'scroll'
	}

	//item이 바뀔때마다 호출
	useEffect(() => {
        switch(item.type) {
            case 'JOIN':
                setItems(item.data.chats);
                break;
            case 'SEND':
                setItems([...items, item.data]);
                break;
            default:
                break
        }
	}, [item])
	//채팅이 갱신될때마다 스크롤을 하단으로 내린다.
	useEffect(() => {
		if (boxRef.current) {
			boxRef.current.scrollTop = boxRef.current.scrollHeight
		}
	}, [items])
    
    const ws = useContext(WebSocketContext);
    const roomNo = useRecoilValue(roomState);
    useEffect(() => {
        if (roomNo === 0) return;
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        const data = { type: 'JOIN', no: roomNo };
		ws.current.send(JSON.stringify(data));
    }, [roomNo])

	return (
		<div 
			style={style}
			ref = {boxRef}
		>
			<ul>
				{
					items.map((item) => {
						let chatStyle = { listStyle: 'none' }
						let message = ''

						if (item.name === user.name) {
							chatStyle.textAlign = 'right'
							message = item.content + ' : ' + item.name
						} else {
							chatStyle.textAlign = 'reft'
							message = item.name + ' : ' + item.content
						}

						if (item.complete !== undefined && item.complete === false) {
							chatStyle.color = '#888888'
						} else if (item.complete !== undefined && item.complete === true) {
						}
						return (
							<li style={chatStyle}>{message}</li>
						)
					})
				}
			</ul>
		</div>
	)
}

export default Chats