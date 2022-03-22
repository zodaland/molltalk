import { atom, selector } from 'recoil'

export const chatState = atom({
	key: 'chat',
	default: [],
})

export const itemState = atom({
    key: 'item',
    default: {},
});