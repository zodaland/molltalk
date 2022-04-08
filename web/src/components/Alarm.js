import { useState, useEffect, useContext } from 'react';

import { invitedWsMsgState } from '../modules/wsMsg';
import { userState } from '../modules/user';
import { roomInfoState } from '../modules/room';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import * as Invitation from '../services/Invitation';
import * as RoomUser from '../services/RoomUser';
import * as Room from '../services/Room';

import { WebSocketContext } from '../library/WebSocketProvider';

const Alarm = () => {
    const [alarms, setAlarms] = useState([]);
    const invitedWsMsg = useRecoilValue(invitedWsMsgState);
    const { user } = useRecoilValue(userState);
    const setRooms = useSetRecoilState(roomInfoState);
    const wsService = useContext(WebSocketContext);
    
    const handleJoin = async (no) => {
        try {
            const joinRes = await RoomUser.create({ no });
            if (joinRes.status !== 201) throw new Error();

            const res = await Room.find();
            if (res.status !== 200) throw new Error();
            setRooms(res.data);
            setAlarms(alarms.filter(alarm => alarm.no!== no));

            if (wsService) wsService.roomEnter(no);
        } catch (error) {
            alert('방 참여 실패');
        }
    };
    const handleDelete = async (no) => {
        try {
            const delRes = await Invitation.del(no);
            if (delRes.status !== 200) throw new Error();
            setAlarms(alarms.filter(alarm => alarm.no !== no));
        } catch (error) {
            alert('초대장 삭제 실패');
        }
    };

    useEffect(() => {
        if (!invitedWsMsg) return;
        setAlarms([...alarms, invitedWsMsg]);
    }, [invitedWsMsg]);

    useEffect(() => {
        const getAlarm = async () => {
            try {
                const res = await Invitation.getMyInvitation(user.no);
                if (res.status !== 200) throw new Error();
                const { data } = res;
                const myAlarms = data.map((myAlarm) => ({
                    no: myAlarm.room_no,
                    id: myAlarm.id,
                    name: myAlarm.name,
                }));
                setAlarms([...myAlarms]);
            } catch (error) {}
        };
        getAlarm();
    }, []);

    return (
        <div className="grid lg:grid-cols-3 grid-cols-2">
        {alarms.map(alarm => (
            <div className="m-2 border border-gray-500 rounded-md" key={alarm.no}>
                <button
                    className="w-4/5 h-12 text-sm rounded-l-md hover:bg-green-200 transition"
                    onClick={() => handleJoin(alarm.no)}
                >
                <p className="inline-block w-1/2 h-4 whitespace-nowrap truncate px-1">{alarm.id}</p>
                님의 초대장
                <br/>
                <p className="inline-block w-1/2 h-4 whitespace-nowrap truncate px-1">{alarm.name}</p>
                방 입장
                </button>
                <button
                    className="float-right w-1/5 h-12 bg-red-200 rounded-r-md hover:bg-red-300 transition"
                    onClick={() => handleDelete(alarm.no)}
                >
                    거절
                </button>
            </div>
        ))}
        </div>
    );
};

export default Alarm;