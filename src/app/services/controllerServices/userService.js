const userRepository = require("../../repositories/userRepository");
const bcrypt = require('bcryptjs');
const limit = 10;

class userService {

    constructor() {
        // dùng để lưu trữ các socket đang online
        this.onlineSockets = {};

    }

    async findOneUserByUsername(username){
        const user = await userRepository.findOne({ username });
        return myUtils.getRecordMongoDB(user);
    }

    async findOneUserById(user_id){
        const user = await userRepository.findOne({ _id: user_id });
        return myUtils.getRecordMongoDB(user);
    }

    getMovementMode(user){
        return user?.settings?.movementMode;
    }

    async encodePassword(password){
        return await bcrypt.hash(password, 10);
    }

    async isValidPassword(password, hash){
        return await bcrypt.compare(password, hash);
    }

    async findByIdAndUpdate(id,update){
        return await userRepository.findByIdAndUpdate(id, update);
    }

    async setUserInGame(user_id, inGame) {
        try {
            const user = await this.findOneUserById(user_id);
            if (user) {
                if (user.inGame !== inGame) {
                    user.inGame = inGame;
                    user.markModified('inGame');
                    await user.save();
                    console.log(`User in-game status updated to ${inGame}`);
                }
            } else {
                console.log("User not found.");
            }
        } catch (error) {
            console.error("Error updating in-game status:", error);
        }
    }

    async checkUser_InFriendRequestSentList(userIdCheck, userId) {
        console.log(userId)
        try {
            const user = await this.findOneUserById(user_id);
            if (!user) {
                console.log("User không tồn tại");
                return false;
            }

            return user.friendRequestSentList.includes(userIdCheck);
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            return false;
        }
    }

    async getFriendInforUser(user_id) {
        try {
            const user = await this.findOneUserById(user_id);
            const listFriend = user.listFriend;
            const users = await userRepository.findUsers({ _id: { $in: listFriend } });

            const inforUsers = users
                .filter((user) => this.checkUserOnline(user._id))
                .filter((user) => this.checkUserOnlineOutOfRoom(user._id))
                .map((user) => this.filterInforUser(user));

            return inforUsers;
        } catch (err) {
            console.log(err);
        }
    }

    checkUserOnline(userId) {
        return this.onlineSockets[userId] ? true : false;
    }

    
    checkUserOnlineOutOfRoom(user_id) {
        const socket = this.onlineSockets[user_id];

        if (!socket) {
            return false;
        }

        const referer = socket.handshake.headers.referer;
        const room_id = referer.split("/")[referer.split("/").length - 1];

        if (this.validateID(room_id)) {
            return false;
        }

        return true;
    }

    
    filterInforUser(user) {
        return {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            level: user.level,
        };
    }

    async getInforUserInRoom(room) {
        const userIds = [];
        const socketIDInRoom = _io.sockets.adapter.rooms.get(room) || null;

        if (!socketIDInRoom) {
            return [];
        }

        socketIDInRoom.forEach((socketID) => {
            const socket = _io.sockets.sockets.get(socketID);
            const user_id = socket.user_id;
            if (user_id && !userIds.includes(user_id)) {
                userIds.push(user_id);
            }
        });

        try {
            const users = await userRepository.findUsers({ _id: { $in: userIds } });
            const inforUsers = users.map((user) => this.filterInforUser(user));
            return inforUsers;
        } catch (err) {
            console.log(err);
        }
    }

    getSocketByUserId(userId) {
        return this.onlineSockets[userId] || null; // Trả về socket hoặc null nếu không online
    }

}

module.exports = new userService;