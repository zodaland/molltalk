import { useState, useEffect } from 'react'

import Header from './Header'
import Room from './Room'
import Invitation from './Invitation'
import Chats from './Chats'
import Alarm from './Alarm';

import TextInputBox from './TextInputBox'
import WebSocketProvider from '../library/WebSocketProvider'
import * as User from '../services/User'

import { chatState, itemState } from '../modules/chat'
import { userState } from '../modules/user'
import { roomState } from '../modules/room';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

const App = props => {
	const [userInfo, setUserInfo] = useRecoilState(userState);
	const setItem = useSetRecoilState(itemState);
    const roomNo = useRecoilValue(roomState);

	const fetchUserAuth = async (token) => {
		try {
			const fetchData = await User.check(token)

			if (fetchData.status !== 200) {
                setUserInfo({
					isLogin: false,
					user: {
						no: '',
						id: '',
						name: ''
					}
				})
                throw new Error();
            }
            setUserInfo({
                isLogin: true,
                user: fetchData.data
            })
		} catch(error) {}
	}

	const handleMessageUpdate = (data) => {
		setItem(data)
	}

	useEffect(async () => {
		const fetchData = await fetchUserAuth()
	}, [])

	return (
		<div>
			<Header />
			{ userInfo.isLogin && (
			<WebSocketProvider onMessage={handleMessageUpdate}>
                <Alarm />
				<Room />
                {roomNo !== 0 && (
				<Chats />
                )}
				<TextInputBox />
			</WebSocketProvider>
			) }
		</div>
	)
}

export default App