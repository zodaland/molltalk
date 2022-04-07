import { useState } from 'react'
import * as User from '../services/User'

import { userState } from '../modules/user';
import { useRecoilState, useSetRecoilState } from 'recoil';

const Header = () => {
    const [userInfo, setUserInfo] = useRecoilState(userState);

    const handleLogout = async () => {
        try {
            const fetchData = await User.logout()
            if (fetchData.status !== 200) throw new Error();
            window.location.reload();
        } catch(error) {
            alert('로그아웃 실패');
        }
    };

    return (
        <div className="header">
            { userInfo.isLogin
                ? <button onClick={handleLogout}>로그아웃</button>
                : <AuthComponent />
            }
        </div>
    );
};

const AuthComponent = () => {
    const [isRegister, setIsRegister] = useState(false);

    const handleToggle= () => {
        setIsRegister(!isRegister);
    };

    return (
        <>
        {
            isRegister
                ? <RegisterComponent handleToggle={handleToggle} />
                : <LoginComponent handleToggle={handleToggle} />
        }
        </>
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
            const fetchData = await User.login(loginInfo);
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
        <div>
            <button onClick={handleToggle}>회원가입</button>
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
            const fetchData = await User.regist(registerInfo);
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
        <div>
            <button onClick={handleToggle}>로그인</button>
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