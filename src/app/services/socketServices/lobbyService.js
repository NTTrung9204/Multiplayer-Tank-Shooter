const userService = require("../controllerServices/userService");

class lobbyService {

    getRooms() {
        return roomLobby.rooms;
    }

    async createRoomTeamMatch(user_id, idMap, passwordRoom) {
        const user = await userService.findOneUserById(user_id);
        if (!user) {
            return { error: 'User not found' };
        } else {
            const map = await mapService.getMapById(idMap);
            if (!map) {
                return { error: 'Map not found' };
            } else {
                const room_id = myUtils.generateID();
                roomLobby.addNewRoom({
                    id: room_id,
                    nameRoom: "Room " + roomLobby.getQuantityRoom() + 1,
                    password: passwordRoom,
                    idMap: idMap,
                    nameMap: map.mapName,
                    players: [
                        {
                            id: user_id,
                            username: user.username,
                            role: "host",
                            team: "dog",
                            avatar: user.avatar,
                            isReady: false,
                            playing: false,
                        }
                    ]
                })
                //inGame=true
                // await userService.setUserInGame(user_id, false);
                return { room_id: room_id, nameMap: map.mapName };
            }
        }
    }

    confirmPassword(idRoom, password) {
        const room = roomLobby.findRoom(idRoom);
        if (room.id === idRoom && room.password === password) {
            return true;
        } else {
            return false;
        }
    }

    async getStatusUser(user_id) {
        const user = await userService.findOneUserById(user_id);
        return { inGame: user.inGame };
    }
}

module.exports = new lobbyService;