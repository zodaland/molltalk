import { useState, useEffect } from 'react'
import * as RoomAxios from '../services/Room';
import * as RoomUser from '../services/RoomUser';
import Invitation from './Invitation';

import { roomState, roomsState } from '../modules/room';
import { useRecoilState } from 'recoil';

const Room = () => {
    const [rooms, setRooms] = useRecoilState(roomsState);
    const [name, setName] = useState('');
    const [roomNo, setRoomNo] = useRecoilState(roomState);
    const handleDelete = async (no) => {
        try {
            const res = await RoomUser.deleteRoomUser(no);
            if (res.status !== 200) throw new Error();
            setRoomNo(0);
            setRooms(rooms.filter(data => data.no !== no));
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
            if (res.status !== 200) throw new Error();

            getRooms();
        } catch (error) {
            alert('방생성 실패');
        }
    };
    const getRooms = async () => {
        try {
            const res = await RoomAxios.find();
            if (res.status !== 200) throw new Error();
            setRooms(res.data);
        } catch (error) { }
    };
    
    useEffect(() => {
      getRooms();
    }, []); 

    return (
        <div>
            <div>
                {rooms.map(data => (
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