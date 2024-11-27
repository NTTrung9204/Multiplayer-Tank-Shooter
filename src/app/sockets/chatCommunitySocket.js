class chatCommunitySocket {
    connection(socket) {
        socket.on("ChatCommunity__sendMessage__Server", async (message)=>{
            message = await chatService.createMessage(message);
            if (!message) {
                return;
            }
            _io.emit("Server__sendMessage__ChatCommunity", message)
        })
    }
}

module.exports = new chatCommunitySocket();