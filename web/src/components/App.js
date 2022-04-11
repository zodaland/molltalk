import { useEffect } from 'react';

import Header from './Header';
import Room from './Room';
import Chats from './Chats';
import Alarm from './Alarm';

import WebSocketProvider from '../library/WebSocketProvider';

import * as user from '../services/user';

import { userState } from '../modules/user';
import { roomState } from '../modules/chat';
import { useSetRecoilState, useRecoilValue } from 'recoil';

const App = props => {
    const setUserInfo = useSetRecoilState(userState);
    const { isLogin } = useRecoilValue(userState);
    const roomNo = useRecoilValue(roomState);

    useEffect(() => {
        const fetchUserAuth = async (token) => {
            try {
                const fetchData = await user.check(token);

                if (fetchData.status !== 200) {
                    setUserInfo({
                        isLogin: false,
                        user: {
                            no: '',
                            id: '',
                            name: ''
                        }
                    });
                    throw new Error();
                }
                setUserInfo({
                    isLogin: true,
                    user: fetchData.data
                });
            } catch(error) {}
        };

        fetchUserAuth();
    }, [setUserInfo]);

    return (
        <WebSocketProvider>
            <div className="flex justify-center h-screen">
                <div className="lg:w-1/2 w-full">
                    <Header />
                    {isLogin && (
                        <Alarm />
                    )}
                    {isLogin && (roomNo !== 0 ? (
                        <Chats /> 
                    ) : (
                        <Room />
                    ))}
                </div>
            </div>
        </WebSocketProvider>
    )
}

export default App;