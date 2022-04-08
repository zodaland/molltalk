function WsService(ws) {
    this.ws = ws;
    this.send = (data) => {
        const jsonData = JSON.stringify(data);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(jsonData);
    }
    this.exit = () => this.send({ type: 'EXIT' });
    this.chat = (content) => this.send({ type: 'SEND', content });
    this.invite = (no) => this.send({ type: 'INVITE', no });
    this.join = (no) => this.send({ type: 'JOIN', no });
    this.roomExit = (no) => this.send({ type: 'ROOMEXIT', no });
    this.roomEnter = (no) => this.send({ type: 'ROOMENTER', no });
}

export default WsService;