import { useState, useEffect, useContext } from 'react'

import { findById } from '../services/User';
import * as Room from '../services/Room';
import * as Invitation from '../services/Invitation';

import { userState } from '../modules/user';
import { roomState } from '../modules/chat';
import { useRecoilValue } from 'recoil';

import { WebSocketContext } from '../library/WebSocketProvider'

const UserInvitation = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [no, setNo] = useState(0);
    const [isFound, setIsFound] = useState(false);

    const handleId = (e) => {
        setId(e.target.value);
        setIsFound(false);
        setName('');
        setNo(0);
    }

    const handleFind = async () => {
        try {
            const res = await findById(id);
            if (res.status !== 200) throw new Error();
            setNo(res.data.no);
            setName(res.data.name);
            setIsFound(true);
        } catch {};
    };

    return (
        <>
            <div className="flex mx-2 mb-2">
                <input
                    className="flex-grow border border-black rounded-md p-1 text-sm"
                    name="id"
                    value={id}
                    placeholder="아이디 입력"
                    onChange={handleId}
                />
                <button
                    className="rounded-md bg-blue-100 py-1 px-6 ml-3 text-sm"
                    onClick={handleFind}
                >
                    찾기
                </button>
            </div>
            {isFound && <UserComponent name={name} invitedUserNo={no} />}
        </>
    );
};

const UserComponent = ({ name, invitedUserNo }) => {
    const { user } = useRecoilValue(userState);
    const roomNo = useRecoilValue(roomState);
    const wsService = useContext(WebSocketContext);
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
            if (inviteRes.status !== 201) throw new Error();
            const roomName = inviteRes.data;

            if (wsService) wsService.invite(invitedUserNo);

            alert('초대 되었습니다.');
        } catch(error) {
            alert('실패')
        }
    }
    return (
        <div className="flex m-2">
            <span className="rounded-md p-1 text-sm border rounded-md px-6">{name}</span>
            <button
                className="rounded-md bg-blue-200 py-1 px-6 ml-3 text-sm"
                onClick={handleInvite}
            >
                초대
            </button>
        </div>
    );
};

export default UserInvitation;