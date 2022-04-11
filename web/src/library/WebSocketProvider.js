import { useState, useRef, useEffect, useCallback, createContext } from 'react';

import { wsMsgState } from '../modules/wsMsg';
import { userState } from '../modules/user';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import WsService from '../services/Ws';

const WebSocketContext = createContext(null);
export { WebSocketContext };

const WebSocketProvider = (props) => {
    const { isLogin } = useRecoilValue(userState);
    const setWsMsgState = useSetRecoilState(wsMsgState);
	const ws = useRef(null);
    const [wsService, setWsService] = useState(new WsService(ws.current));

	//websocket start
	const webSocketInit = useCallback(() => {
        const checkConnection = () => {
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
                webSocketInit();
                setTimeout(checkConnection, 500);
            }
        };

        const heartbeat = () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'HEART' }));
                setTimeout(heartbeat, 500);
            }
        };

		const webSocketUrl = `wss://api.zodaland.com`;

        ws.current = new WebSocket(webSocketUrl);
        setWsService(new WsService(ws.current));
        ws.current.onopen = () => heartbeat();
        ws.current.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            setWsMsgState(data);
        }
        ws.current.onclose = error => isLogin && checkConnection();
        ws.current.onerror = error => isLogin && checkConnection();
	}, [isLogin, setWsMsgState]);

	//Component Did Mount
	useEffect(() => {
        const checkConnection = () => {
            if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
                webSocketInit();
                setTimeout(checkConnection, 500);
            }
        }

        if (!isLogin) return;
        checkConnection();
	}, [isLogin, webSocketInit]);

	return (
		<WebSocketContext.Provider value={wsService}>
			{props.children}
		</WebSocketContext.Provider>
	);
}

export default WebSocketProvider;