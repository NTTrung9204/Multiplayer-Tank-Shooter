class chatCommunityApi {
    async getChatCommunity(req, res) {
        const messages = await chatService.getLastMessages();
        res.send(messages);
    }
}

module.exports = new chatCommunityApi;