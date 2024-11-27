const chatDB = require('../models/Chat');

class chatRepository {
    createChat(chatData) {
        return chatDB.create(chatData);
    }

    findChatsByUserId(userId) {
        return chatDB.find({user_id: userId});
    }

    findLastMessages() {
        return chatDB.find().limit(10);
    }
}

module.exports = new chatRepository;