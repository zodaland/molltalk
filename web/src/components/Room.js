import { useState, useEffect, useContext } from 'react'
import * as RoomAxios from '../services/Room';
import * as RoomUser from '../services/RoomUser';

import { roomState } from '../modules/chat';
import { roomInfoState } from '../modules/room';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { WebSocketContext } from '../library/WebSocketProvider';

const Room = () => {
    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
    const [name, setName] = useState('');
    const setRoomNo = useSetRecoilState(roomState);
    const wsService = useContext(WebSocketContext);
    const handleDelete = async (no) => {
        try {
            const res = await RoomUser.deleteRoomUser(no);
            if (res.status !== 200) throw new Error();
            setRoomInfo(roomInfo.filter(data => data.no !== no));
            if (wsService) {
                wsService.roomExit(no);
            }
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

            setName('');
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

    return (
        <div className="mt-1 px-2">
            <div className="my-3 border border-gray-500 rounded-md">
                <input
                    className="w-4/5 h-14 px-1 text-xl rounded-l-md"
                    name="name"
                    onChange={handleChange}
                />
                <button
                    className="float-right w-1/5 h-14 bg-green-200 rounded-r-md hover:bg-green-300 transition"
                    onClick={handleCreate}
                >
                    방생성
                </button>
            </div>
            <div className="flex flex-col">
                {roomInfo.map(data => (
                <div className="my-3 border border-gray-500 rounded-md" key={data.no}>
                    <button
                        className="w-4/5 h-14 px-1 text-xl whitespace-nowrap truncate  rounded-l-md hover:bg-green-200 transition"
                        onClick={() => handleSelect(data.no)} 
                    >
                        {data.name}
                    </button>
                    <button
                        className="float-right w-1/5 h-14 bg-red-200 rounded-r-md hover:bg-red-300 transition"
                        onClick={() =>handleDelete(data.no)}
                    >
                        나가기
                    </button>
                </div>
                )
                )}
            </div>
        </div>
    );
};

export default Room