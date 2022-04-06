import React, { useRef, useEffect } from 'react'

const WebSocketContext = React.createContext(null)
export { WebSocketContext }

export default (props) => {
	const ws = useRef(null)

	//websocket start
	const webSocketInit = () => {
		const webSocketUrl = `wss://api.zodaland.com`

			ws.current = new WebSocket(webSocketUrl)
			ws.current.onopen = () => heartbeat();
			ws.current.onmessage = (evt) => {
				const data = JSON.parse(evt.data)
				props.onMessage(data)
			}
			ws.current.onclose = error => checkConnection();
			ws.current.onerror = error => checkConnection();
	}

	//websocket restart
	const checkConnection = () => {
		if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
			webSocketInit()
            setTimeout(checkConnection, 500);
		}
	}
    const heartbeat = () => {
        if (ws.current || ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'HEART' }));
            setTimeout(heartbeat, 500);
        }
    };

	//Component Did Mount
	useEffect(() => {
        checkConnection();
	}, [])

	return (
		<WebSocketContext.Provider value={ws}>
			{props.children}
		</WebSocketContext.Provider>
	)
}