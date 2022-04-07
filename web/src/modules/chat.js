/*
 *  chats: any[],
 *  room: number,
 *
 */

import { atom, selector } from 'recoil';

export const chatInfoState = atom({
	key: 'chatInfoState',
	default: {
        chats: [],
        room: 0,
    },
});

export const chatsState = selector({
    key: 'chatState',
    get: ({ get }) => {
        const { chats } = get(chatInfoState);
        return chats;
    },
    set: ({ get, set }, chats) => {
        const chatInfo = get(chatInfoState);
        set(chatInfoState, { ...chatInfo, chats });
    },
});

export const roomState = selector({
    key: 'roomState',
    get: ({ get }) => {
        const { room } = get(chatInfoState);
        return room;
    },
    set: ({ get, set }, room) => {
        const chatInfo = get(chatInfoState);
        set(chatInfoState, { ...chatInfo, room });
    },
});