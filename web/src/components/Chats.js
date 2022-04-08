import { useState, useEffect, useRef } from 'react'

import Invitation from './Invitation';
import TextInputBox from './TextInputBox';
import RoomUser from './RoomUser';

import { joinedWsMsgState, sentWsMsgState } from '../modules/wsMsg';
import { chatsState, roomState } from '../modules/chat';
import { userState } from '../modules/user';
import { useRecoilState, useRecoilValue } from 'recoil'

const Chats = () => {
    const joinedWsMsg = useRecoilValue(joinedWsMsgState);
    const sentWsMsg = useRecoilValue(sentWsMsgState);
    const roomNo = useRecoilValue(roomState);

	const [chats, setChats] = useRecoilState(chatsState);

    useEffect(() => {
        if (!joinedWsMsg) return;
        setChats(joinedWsMsg.chats);
    }, [joinedWsMsg]);
    useEffect(() => {
        if (!sentWsMsg) return;
        setChats([...chats, sentWsMsg]);
    }, [sentWsMsg]);

	return (
		<div
            className="w-full h-2/3 text-xl"
		>
            <Invitation />
            <RoomUser />
			<ChatBoxComponent chats={chats} />
            <TextInputBox />
		</div>
	)
}
const ChatBoxComponent = ({ chats }) => {
	const boxRef = useRef(null);

	//채팅이 갱신될때마다 스크롤을 하단으로 내린다.
	useEffect(() => {
		if (boxRef.current) {
			boxRef.current.scrollTop = boxRef.current.scrollHeight
		}
	}, [chats])
    return (
        <ul
            className="mx-2 h-full overflow-y-scroll"
            ref={boxRef}
        >
            {
                chats.map((item) => {
                    if (item.content) return (<ChatComponent item={item} />);
                    if (item.type) return (<StatusChatComponent item={item} />);
                })
            }
        </ul>
    );
}

const ChatComponent = ({ item }) => {
    const { user } = useRecoilValue(userState);
    return (
        <>
        {(item.id === user.id) ? (
            <MyChatComponent item={item} />
        ) : (
            <YourChatComponent item={item} />
        )}
        </>
    )
};

const MyChatComponent = ({ item }) => {
    return (
        <li className="flex justify-end m-6">
            <p className="bg-green-50 rounded-3xl p-2">{item.content}</p>
        </li>
    )
};

const YourChatComponent = ({ item }) => {
    return (
        <li className="flex justify-start m-6">
            <div>
                <p className="text-sm">{item.name}</p>
                <p className="bg-blue-50 rounded-3xl p-2">{item.content}</p>
            </div>
        </li>
    )
};

const StatusChatComponent = ({ item }) => {
    return (
        <>
            {(() => {
                switch (item.type) {
                    case 'ENTER':
                        return (
                            <li className="flex justify-center m-6">
                                <p className="bg-yellow-50 rounded-3xl p-2">{item.name}님이 입장 했습니다.</p>
                            </li>
                        );
                    case 'EXIT':
                        return (
                            <li className="flex justify-center m-6">
                                <p className="bg-red-50 rounded-3xl p-2">{item.name}님이 퇴장 했습니다.</p>
                            </li>
                        );
                    default :
                        return;
                }
            })()}
        </>
    )
};

export default Chats