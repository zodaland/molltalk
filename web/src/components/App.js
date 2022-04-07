import { useState, useEffect } from 'react'

import Header from './Header'
import Room from './Room'
import Invitation from './Invitation'
import Chats from './Chats'
import Alarm from './Alarm';
import RoomUser from './RoomUser';

import TextInputBox from './TextInputBox'
import WebSocketProvider from '../library/WebSocketProvider'
import * as User from '../services/User'

import { userState } from '../modules/user'
import { roomState } from '../modules/chat';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

const App = props => {
	const [userInfo, setUserInfo] = useRecoilState(userState);
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

	useEffect(async () => {
		const fetchData = await fetchUserAuth()
	}, [])

	return (
		<div>
			<Header />
			{ userInfo.isLogin && (
			<WebSocketProvider>
                <Alarm />
				<Room />
                {roomNo !== 0 && (
				<Chats />
                )}
				<TextInputBox />
                <RoomUser />
			</WebSocketProvider>
			) }
		</div>
	)
}

export default App