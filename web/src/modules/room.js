/*
 *  type Room {
 *    name: string,
 *    no: number,
 *  }
 *
 *  Room[]
 *
 */

import { atom } from 'recoil';

export const roomInfoState = atom({
	key: 'roomInfoState',
	default: [],
});