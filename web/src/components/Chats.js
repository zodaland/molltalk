import { useState, useEffect, useRef } from 'react'

import { joinedWsMsgState, sentWsMsgState } from '../modules/wsMsg';
import { chatsState, roomState } from '../modules/chat';
import { userState } from '../modules/user';
import { useRecoilState, useRecoilValue } from 'recoil'

const Chats = () => {
    const joinedWsMsg = useRecoilValue(joinedWsMsgState);
    const sentWsMsg = useRecoilValue(sentWsMsgState);

	const [chats, setChats] = useRecoilState(chatsState)
    const { user } = useRecoilValue(userState);
	//dom 접근 ref 사용
	let boxRef = useRef(null)

	let style = {
		width: '350px',
		height: '200px',
		fontSize: '12px',
		overflowY: 'scroll'
	}

    useEffect(() => {
        if (!joinedWsMsg) return;
        setChats(joinedWsMsg.chats);
    }, [joinedWsMsg]);
    useEffect(() => {
        if (!sentWsMsg) return;
        setChats([...chats, sentWsMsg]);
    }, [sentWsMsg]);

	//채팅이 갱신될때마다 스크롤을 하단으로 내린다.
	useEffect(() => {
		if (boxRef.current) {
			boxRef.current.scrollTop = boxRef.current.scrollHeight
		}
	}, [chats])

	return (
		<div 
			style={style}
			ref = {boxRef}
		>
			<ul>
				{
					chats.map((item) => {
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