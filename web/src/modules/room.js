import { atom } from 'recoil'

export const roomState = atom({
	key: 'room',
	default: 0,
})

export const roomsState = atom({
	key: 'rooms',
	default: [],
})