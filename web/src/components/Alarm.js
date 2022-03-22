import { useState, useEffect } from 'react';

import { itemState } from '../modules/chat';
import { userState } from '../modules/user';
import { roomsState } from '../modules/room';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import * as Invitation from '../services/Invitation';
import * as RoomUser from '../services/RoomUser';
import * as Room from '../services/Room';

const Alarm = () => {
    const [alarms, setAlarms] = useState([]);
    const item = useRecoilValue(itemState);
    const { user } = useRecoilValue(userState);
    const setRooms = useSetRecoilState(roomsState);
    
    const handleJoin = async (roomNo) => {
        try {
            const joinRes = await RoomUser.create({ roomNo });
            if (joinRes.status !== 200) {
                throw new Error();
            }
            const res = await Room.find();
            if (res.status !== 200) throw new Error();
            setRooms(res.data);
            setAlarms(alarms.filter(alarm => alarm.roomNo !== roomNo));
        } catch (error) {
            alert('방 참여 실패');
        }
    };

    useEffect(() => {
        if (item.command === 'invite') {
            console.log(item);
            const myAlarm = { ...item };
            delete myAlarm.command;
            setAlarms([...alarms, myAlarm]);
        }
    }, [item]);

    useEffect(() => {
        const getAlarm = async () => {
            try {
                console.log(user);
                const res = await Invitation.getMyInvitation(user.no);
                if (res.status !== 200) throw new Error();
                const { data } = res;
                const myAlarms = data.map((myAlarm) => ({
                    roomNo: myAlarm.room_no,
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
            <button onClick={() => handleJoin(alarm.roomNo)}>{alarm.name} 입장</button>
        ))}
        </div>
    );
};

export default Alarm;