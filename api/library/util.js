exports.wsSend = (ws, data) => {
    console.log(data);
    ws.send(JSON.stringify(data));
};