class chatService {
    createMessage = async (message) => {
        const time = myUtils.getTimeNow();
        message.time = time;
        const user_id = message.user_id;
        const user = await userService.findOneUserById(user_id);
        const savedMessage = await chatRepository.createChat({user_id, message: message.message, time});
        if (!savedMessage) {
            return false;
        }
        message.username = user.username;
        message.avatar = user.avatar;

        return message;
    };

    getLastMessages = async () => {
        const messages = await chatRepository.findLastMessages();
        const messagesWithUser = await Promise.all(messages.map(async (message) => {
            message = message.toObject();
            const user = await userService.findOneUserById(message.user_id);
            message.username = user.username;
            message.avatar = user.avatar;
        
            return message;
        }));

        console.log(messagesWithUser);

        return messagesWithUser;
    };
}

module.exports = new chatService();