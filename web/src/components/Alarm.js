import { useState, useEffect } from 'react';

import { invitedWsMsgState } from '../modules/wsMsg';
import { userState } from '../modules/user';
import { roomInfoState } from '../modules/room';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import * as Invitation from '../services/Invitation';
import * as RoomUser from '../services/RoomUser';
import * as Room from '../services/Room';

const Alarm = () => {
    const [alarms, setAlarms] = useState([]);
    const invitedWsMsg = useRecoilValue(invitedWsMsgState);
    const { user } = useRecoilValue(userState);
    const setRooms = useSetRecoilState(roomInfoState);
    
    const handleJoin = async (no) => {
        try {
            const joinRes = await RoomUser.create({ no });
            if (joinRes.status !== 201) {
                throw new Error();
            }
            const res = await Room.find();
            if (res.status !== 200) throw new Error();
            setRooms(res.data);
            setAlarms(alarms.filter(alarm => alarm.no!== no));
        } catch (error) {
            alert('방 참여 실패');
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
        <div>
        {alarms.map(alarm => (
            <button onClick={() => handleJoin(alarm.no)}>{alarm.id}의 초대 {alarm.name}방 입장</button>
        ))}
        </div>
    );
};

export default Alarm;