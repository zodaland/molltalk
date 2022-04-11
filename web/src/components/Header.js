import { useState, useEffect, useContext } from 'react'
import * as user from '../services/user'

import { userState } from '../modules/user';
import { roomState } from '../modules/chat';
import { roomInfoState } from '../modules/room';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { WebSocketContext } from '../library/WebSocketProvider'

const Header = () => {
    const { isLogin } = useRecoilValue(userState);

    return (
        <header>
            { isLogin
                ? <LogoutComponent />
                : <AuthComponent />
            }
        </header>
    );
};

const LogoutComponent = () => {
    const { user } = useRecoilValue(userState);
    const [roomNo, setRoomNo] = useRecoilState(roomState);
    const roomInfo = useRecoilValue(roomInfoState);
    const [roomName, setRoomName] = useState('');

    const handleLogout = async () => {
        try {
            const fetchData = await user.logout()
            if (fetchData.status !== 200) throw new Error();
            window.location.reload();
        } catch (error) {
            alert('로그아웃 실패');
        }
    };

    const handleClick = (e) => setRoomNo(0);

    //채팅방 입장시 방이름 추출
    useEffect(() => {
        const room = roomInfo.find(room => room.no === roomNo);
        if (!room) {
            setRoomName('');
        } else {
            setRoomName(room.name);
        }
    }, [roomNo, roomInfo]);

    //채팅방 입/퇴장 처리
    const wsService = useContext(WebSocketContext);
    useEffect(() => {
        if (!wsService) return;
        if (roomNo === 0) {
            wsService.exit();
        } else {
            wsService.join(roomNo);
        }
    }, [roomNo, wsService])

    return (
        <div className="grid grid-cols-3 border-b border-gray-500">
            <span className="h-12 m-4 p-2 text-xl text-center border rounded-md whitespace-nowrap truncate">{user.name}</span>
            { roomName && (
                <button
                    className="h-12 m-4 py-2 px-5 text-xl text-center border rounded-md whitespace-nowrap truncate hover:bg-red-200 transition"
                    onClick={handleClick}
                >
                    {roomName}
                </button>
            )}
            <button className="col-start-3 h-12 m-4 p-2 text-xl border rounded-md hover:bg-gray-200 transition" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

const AuthComponent = () => {
    const [isRegister, setIsRegister] = useState(false);

    const handleToggle= () => {
        setIsRegister(!isRegister);
    };

    return (
        <div className="flex justify-center w-full h-screen">
            <div className="lg:w-2/5 w-3/5 self-center">
                {
                    isRegister
                        ? <RegisterComponent handleToggle={handleToggle} />
                        : <LoginComponent handleToggle={handleToggle} />
                }
            </div>
        </div>
    );
}

const LoginComponent = ({ handleToggle }) => {
    const setUserInfo = useSetRecoilState(userState);
    const [loginInfo, setLoginInfo] = useState({
        id: '',
        password: '',
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const fetchData = await user.login(loginInfo);
            if (fetchData.status !== 200) {
                alert('로그인 실패');
                return;
            }
            const { data } = fetchData;
            setLoginInfo({
                id: '',
                password: '',
            });
            setUserInfo({
                isLogin: true,
                user: data,
            })
        } catch(error) {
            alert('로그인 실패')
        }
    };
    return (
        <div className="border border-gray-500 rounded-md p-3">
            <form className="space-y-2" onSubmit={handleLogin}>
                <input
                    className="w-full border text-xl p-2"
                    name="id"
                    value={loginInfo.id}
                    placeholder="아이디"
                    onChange={handleChange}
                />
                <p/>
                <input
                    className="w-full border text-xl p-2"
                    type="password"
                    name="password"
                    value={loginInfo.password}
                    placeholder="비밀번호"
                    onChange={handleChange}
                />
                <p/>
                <button className="w-full rounded-md text-2xl p-2 bg-blue-200 hover:bg-blue-300 transition">
                    로그인
                </button>
            </form>
            <button
                className="w-full border-2 border-gray-500 rounded-md text-2xl p-2 bg-gray-100 hover:bg-gray-200 transition mt-12"
                onClick={handleToggle}>
                    회원가입
            </button>
        </div>
    );
};

const RegisterComponent = ({ handleToggle }) => {
    const [registerInfo, setRegisterInfo] = useState({
        id: '',
        name: '',
        password: '',
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setRegisterInfo({
            ...registerInfo,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const fetchData = await user.regist(registerInfo);
            if (fetchData.status !== 201) {
                throw new Error();
            }
            setRegisterInfo({
                id: '',
                name: '',
                password: '',
            });
            handleToggle();

            alert('회원가입 성공');
        } catch(error) {
            alert('회원가입 실패');
        }
    };

    return (
        <div className="border border-gray-500 rounded-md p-3">
            <form className="space-y-2" onSubmit={handleRegister}>
                <input
                    className="w-full border text-xl p-2"
                    name="id"
                    value={registerInfo.id}
                    placeholder="아이디"
                    onChange={handleChange}
                />
                <p/>
                <input
                    className="w-full border text-xl p-2"
                    name="name"
                    value={registerInfo.name}
                    placeholder="이름"
                    onChange={handleChange}
                />
                <p/>
                <input
                    className="w-full border text-xl p-2"
                    type="password"
                    name="password"
                    value={registerInfo.password}
                    placeholder="비밀번호"
                    onChange={handleChange}
                />
                <p/>
                <button className="w-full rounded-md text-2xl p-2 bg-green-200 hover:bg-green-300 transition">
                    등록
                </button>
            </form>
            <button
                className="w-full border-2 border-gray-500 rounded-md text-2xl p-2 bg-gray-100 hover:bg-gray-200 transition mt-12"
                onClick={handleToggle}
            >
                로그인
            </button>
        </div>
    );
};

export default Header;