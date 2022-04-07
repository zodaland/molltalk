import { useState, useEffect, useContext } from 'react'
import * as RoomAxios from '../services/Room';
import * as RoomUser from '../services/RoomUser';
import Invitation from './Invitation';

import { roomState } from '../modules/chat';
import { roomInfoState } from '../modules/room';
import { useRecoilState } from 'recoil';

import { WebSocketContext } from '../library/WebSocketProvider'

const Room = () => {
    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
    const [name, setName] = useState('');
    const [roomNo, setRoomNo] = useRecoilState(roomState);
    const handleDelete = async (no) => {
        try {
            const res = await RoomUser.deleteRoomUser(no);
            if (res.status !== 200) throw new Error();
            setRoomNo(0);
            setRoomInfo(roomInfo.filter(data => data.no !== no));
        } catch (error) {
            alert('제거 실패');
        }
    }
    const handleSelect = (no) => setRoomNo(no);
    const handleChange = (e) => setName(e.target.value);
    
    const handleCreate = async () => {
        if (!name) {
            alert('방이름을 입력하세요.');
            return;
        }
        try {
            const res = await RoomAxios.create({ name });
            if (res.status !== 201) throw new Error();

            getRooms();
        } catch (error) {
            alert('방생성 실패');
        }
    };
    const getRooms = async () => {
        try {
            const res = await RoomAxios.find();
            if (res.status !== 200) throw new Error();
            setRoomInfo(res.data);
        } catch (error) { }
    };
    
    useEffect(() => {
      getRooms();
    }, []); 

    const ws = useContext(WebSocketContext);
    useEffect(() => {
        if (roomNo === 0) return;
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        const data = { type: 'JOIN', no: roomNo };
		ws.current.send(JSON.stringify(data));
    }, [roomNo])

    return (
        <div>
            <div>
                {roomInfo.map(data => (
                <>
                <div>
                    <button onClick={() =>handleSelect(data.no)} key={data.no}>{data.name}</button>
                </div>
                <div>
                    <button onClick={() =>handleDelete(data.no)}>방 제거</button>
                </div>
                </>
                )
                )}
            </div>
            <input name="name" onChange={handleChange} />
            <button onClick={handleCreate}>방생성</button>
                {roomNo !== 0 && 
                <Invitation />}
        </div>
    );
};

export default Room