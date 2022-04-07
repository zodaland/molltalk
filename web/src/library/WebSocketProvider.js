import { useRef, useEffect, createContext } from 'react';

import { wsMsgState } from '../modules/wsMsg';
import { useSetRecoilState } from 'recoil';

const WebSocketContext = createContext(null);
export { WebSocketContext };

export default (props) => {
    const setWsMsgState = useSetRecoilState(wsMsgState);
	const ws = useRef(null);

	//websocket start
	const webSocketInit = () => {
		const webSocketUrl = `wss://api.zodaland.com`;

			ws.current = new WebSocket(webSocketUrl);
			ws.current.onopen = () => heartbeat();
			ws.current.onmessage = (evt) => {
				const data = JSON.parse(evt.data);
                setWsMsgState(data);
			}
			ws.current.onclose = error => checkConnection();
			ws.current.onerror = error => checkConnection();
	}

	//websocket restart
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

	//Component Did Mount
	useEffect(() => {
        checkConnection();
	}, []);

	return (
		<WebSocketContext.Provider value={ws}>
			{props.children}
		</WebSocketContext.Provider>
	);
}