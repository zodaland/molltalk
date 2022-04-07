import { useState, useEffect } from 'react';

import { roomState } from '../modules/chat';
import { enteredWsMsgState, exitedWsMsgState, joinedWsMsgState } from '../modules/wsMsg';
import { useRecoilValue } from 'recoil';

const RoomUser = () => {
    const enteredWsMsg = useRecoilValue(enteredWsMsgState);
    const exitedWsMsg = useRecoilValue(exitedWsMsgState);
    const joinedWsMsg = useRecoilValue(joinedWsMsgState);

    const room = useRecoilValue(roomState);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!enteredWsMsg) return;
        setUsers([...users, enteredWsMsg.user]);
    }, [enteredWsMsg]);

    useEffect(() => {
        if (!exitedWsMsg) return;
        setUsers(users.filter(user => user.id !== exitedWsMsg.user.id));
    }, [exitedWsMsg]);

    useEffect(() => {
        if (!joinedWsMsg) return;
        setUsers(joinedWsMsg.users);
    }, [joinedWsMsg]);

    useEffect(() => {
        setUsers([]);
    }, [room]);

    return (
        <div>
            {users.length > 0 && users.map((user) => (
            <div>{user.name}</div>
            ))}
        </div>
    );
}

export default RoomUser;