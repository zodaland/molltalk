import { atom, selector } from 'recoil'

export const userState = atom({
	key: 'user',
	default: {
        token: '',
        isLogin: false,
        user: {
            no: '',
            id: '',
            name: ''
        }
    }
})