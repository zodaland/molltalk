import { useState } from 'react'
import '../css/Header.css'
import * as User from '../services/User'

import { userState } from '../modules/user';
import { useRecoilState, useSetRecoilState } from 'recoil';

const Header = () => {
    const [userInfo, setUserInfo] = useRecoilState(userState);

    const handleLogout = async () => {
        try {
            const fetchData = await User.logout()
            if (fetchData.data.code === '0000') {
                setUserInfo({
                    token: '',
                    isLogin: false,
                    user: {
                        no: '',
                        id: '',
                        name: ''
                    }
                });
            }
        } catch(error) {
            alert('로그아웃 실패');
        }
    };

    return (
        <div className="header">
            { userInfo.isLogin
                ? <button onClick={handleLogout}>로그아웃</button>
                : <LoginComponent />
            }
        </div>
    );
};

const LoginComponent = () => {
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
            const fetchData = await User.login(loginInfo);
            if (fetchData.status !== 200) {
                alert('로그인 실패');
                return;
            }
            const { data, accessToken } = fetchData.data;

            setLoginInfo({
                id: '',
                password: '',
            });

            setUserInfo({
                token: accessToken,
                isLogin: true,
                user: data,
            })

            alert('로그인 성공')
        } catch(error) {
            alert('로그인 실패')
        }
    };

    const [isRegister, setIsRegister] = useState(false);

    const handleToggleRegister = () => {
        setIsRegister(!isRegister);
    };

    return (
        <>
        { isRegister
            ? <RegisterComponent handleClear={handleToggleRegister} />
            : (
            <div>
                <button onClick={handleToggleRegister}>회원가입</button>
                <form onSubmit={handleLogin}>
                    <input
                        name="id"
                        value={loginInfo.id}
                        placeholder="아이디"
                        onChange={handleChange}
                    />
                    <p/>
                    <input
                        type="password"
                        name="password"
                        value={loginInfo.password}
                        placeholder="비밀번호"
                        onChange={handleChange}
                    />
                    <p/>
                    <button>로그인</button>
                </form>
            </div>
        )}
        </>
    );
};

const RegisterComponent = ({ handleClear }) => {
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
            const fetchData = await User.regist(registerInfo);
            if (fetchData.status !== 201) {
                throw new Error();
            }
            setRegisterInfo({
                id: '',
                name: '',
                password: '',
            });
            handleClear();

            alert('회원가입 성공');
        } catch(error) {
            alert('회원가입 실패');
        }
    };

    return (
        <div>
            <button onClick={handleClear}>로그인</button>
            <form onSubmit={handleRegister}>
                <input
                    name="id"
                    value={registerInfo.id}
                    placeholder="아이디"
                    onChange={handleChange}
                />
                <p/>
                <input
                    name="name"
                    value={registerInfo.name}
                    placeholder="이름"
                    onChange={handleChange}
                />
                <p/>
                <input
                    type="password"
                    name="password"
                    value={registerInfo.password}
                    placeholder="비밀번호"
                    onChange={handleChange}
                />
                <p/>
                <button>등록</button>
            </form>
        </div>
    );
};

export default Header;