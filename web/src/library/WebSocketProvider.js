import React, { useRef, useEffect } from 'react'

const WebSocketContext = React.createContext(null)
export { WebSocketContext }

export default (props) => {
	const ws = useRef(null)

	let connInterval = null
	//websocket start
	const webSocketInit = () => {
		const webSocketUrl = `wss://api.zodaland.com`

			ws.current = new WebSocket(webSocketUrl)
			ws.current.onopen = () => {
				clearInterval(connInterval)
				connInterval = null
			}
			ws.current.onmessage = (evt) => {
				const data = JSON.parse(evt.data)
				props.onMessage(data)
			}
			ws.current.onclose = error => {
				if (!connInterval) {
					connInterval = setInterval(() => {
						checkConnection(ws)
					}, 10000)
				}
			}
			ws.current.onerror = error => {
				if (!connInterval) {
					connInterval = setInterval(() => {
						checkConnection()
					}, 10000)
				}
			}
	}

	//websocket restart
	const checkConnection = () => {
		if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
			webSocketInit()
		}
	}

	//Component Did Mount
	useEffect(() => {
		checkConnection()
	})

	return (
		<WebSocketContext.Provider value={ws}>
			{props.children}
		</WebSocketContext.Provider>
	)
}