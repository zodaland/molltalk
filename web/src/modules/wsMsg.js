/*
 *  status?: number
 *  type?: string
 *  data: any
 *
 */

import { atom, selector } from 'recoil';

export const wsMsgState = atom({
    key: 'wsMsgState',
    default: {},
});

export const sentWsMsgState = selector({
    key: 'sentWsMsgState',
    get: ({ get }) => {
        const wsMsg = get(wsMsgState);

        if (wsMsg.status || wsMsg.type !== 'SEND') return null;
        return wsMsg.data;
    },
});

export const joinedWsMsgState = selector({
    key: 'joinedWsMsgState',
    get: ({ get }) => {
        const wsMsg = get(wsMsgState);

        if (wsMsg.status || wsMsg.type !== 'JOIN') return null;
        return wsMsg.data;
    },
});

export const exitedWsMsgState = selector({
    key: 'exitedWsMsgState',
    get: ({ get }) => {
        const wsMsg = get(wsMsgState);

        if (wsMsg.status || wsMsg.type !== 'EXIT') return null;
        return wsMsg.data;
    },
});

export const enteredWsMsgState = selector({
    key: 'enteredWsMsgState',
    get: ({ get }) => {
        const wsMsg = get(wsMsgState);

        if (wsMsg.status || wsMsg.type !== 'ENTER') return null;
        return wsMsg.data;
    },
});

export const invitedWsMsgState = selector({
    key: 'invitedWsMsgState',
    get: ({ get }) => {
        const wsMsg = get(wsMsgState);

        if (wsMsg.status || wsMsg.type !== 'INVITE') return null;
        return wsMsg.data;
    },
});