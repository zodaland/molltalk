import { useState, useEffect, useContext } from 'react'

import { findById } from '../services/User';
import * as Room from '../services/Room';
import * as Invitation from '../services/Invitation';

import { userState } from '../modules/user';
import { roomState } from '../modules/room';
import { useRecoilValue } from 'recoil';

import { WebSocketContext } from '../library/WebSocketProvider'

const UserInvitation = () => {
    const [id, setId] = useState('');
    const [no, setNo] = useState(0);
    const [isFound, setIsFound] = useState(false);

    const handleId = (e) => {
        setId(e.target.value);
        setIsFound(false);
        setNo(0);
    }

    const handleFind = async () => {
        try {
            const res = await findById(id);
            if (res.status !== 200) {
                throw new Error();
            }
            setNo(res.data.no);
            setIsFound(true);
        } catch {};
    };

    return (
        <div>
            <input
                name="id"
                value={id}
                onChange={handleId}
            />
            <button onClick={handleFind}>찾기</button>
            {isFound && <UserComponent id={id} invitedUserNo={no} />}
        </div>
    );
};

const UserComponent = ({ id, invitedUserNo }) => {
    const { user } = useRecoilValue(userState);
    const roomNo = useRecoilValue(roomState);
    const ws = useContext(WebSocketContext);
    const handleInvite = async () => {
        try {
            const params = {
                roomNo,
                invitedUserNo
            };
            const inviteRes = await Invitation.create(params);
            
            if (inviteRes.status === 202) {
                alert('이미 초대되었습니다');
                return;
            }
            if (inviteRes.status === 204) {
                alert('이미 방에 있습니다');
                return;
            }
            if (inviteRes.status !== 200) throw new Error();
            const roomName = inviteRes.data;

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    type: 'ALARM',
                    command: 'invite',
                    roomNo: params.roomNo,
                    id: user.id,
                    name: roomName,
                    no: invitedUserNo,
                }));
            }

            alert('초대 되었습니다.');
        } catch(error) {
            alert('실패')
        }
    }
    return (
        <div>
            <span>{id}</span>
            <button onClick={handleInvite}>초대</button>
        </div>
    );
};

export default UserInvitation;