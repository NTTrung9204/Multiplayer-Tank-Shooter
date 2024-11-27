const mapService = require("../controllerServices/mapService");
const matchService = require("../controllerServices/matchService");
const userService = require("../controllerServices/userService");

class roomService {
    changeMap(room_id, idMap) {
        const map = mapService.getMapById(idMap);
        if (!map) {
            return null;
        } else {
            const room = roomLobby.findRoom(room_id);
            if (!room) {
                console.log("Room not found");
                return null;
            } else {
                room.idMap = idMap;
                room.nameMap = map.mapName;
                return room;
            }
        }
    }

    changeTeam(user_id, room_id) {
        if (roomLobby.getQuantityPlayerInRoom(room_id) < 8) {
            const catTeamQuantities = roomLobby.getQuantityPlayerInTeamCat(room_id);
            const dogTeamQuantities = roomLobby.getQuantityPlayerInTeamDog(room_id);
            const currentPlayer = roomLobby.findPlayerInRoom(room_id, user_id);
            if (currentPlayer.team === "cat" && dogTeamQuantities >= 4) return null;
            if (currentPlayer.team === "dog" && catTeamQuantities >= 4) return null;

            currentPlayer.team = currentPlayer.team === "cat" ? "dog" : "cat";
            return roomLobby.findRoom(room_id);
        }
    }


    async connectToTeamMatch(user_id, id_room) {
        const room = roomLobby.findRoom(id_room);
        if (!room) {
            return { success: false, message: "Room not found" };
        }

        const player = roomLobby.findPlayerInRoom(id_room, user_id);//true
        if (!player) {
            if (roomLobby.checkFullPlayer(id_room)) {
                return { success: false, message: "Room is full" };
            }

            const user = await userService.findOneUserById(user_id);
            if (!user) {
                return { success: false, message: "User not found" };
            } else {
                userService.setUserInGame(user_id, false);
                roomLobby.addNewPlayerToRoom(id_room, {
                    id: user_id,
                    username: user.username,
                    role: "guest",
                    team: myUtils.decisionTeam(roomLobby.queryPlayerInRoom(id_room)),
                    avatar: user.avatar,
                    playing: false,
                });
                return { success: true, ready: false, room: roomLobby.findRoom(id_room) };
            }
        } else {
            return { success: true, ready: true, rooms: roomLobby.rooms, room: roomLobby.findRoom(id_room) };
        }
    }

    sendMessage(id_room, user_id) {
        return roomLobby.findPlayerInRoom(id_room, user_id);
    }

    exitRoom(user_id, id_room) {
        const player = roomLobby.findPlayerInRoom(id_room, user_id);
        if (player) {
            const room = roomLobby.findRoom(id_room);
            if (roomLobby.getQuantityPlayerInRoom(id_room) > 1) {
                const role = player.role;
                if (role === "host") {
                    const nextHost = roomLobby.queryPlayerInRoom(id_room).find((p) => p.team === player.team && p.id !== user_id);
                    if (nextHost) {
                        nextHost.role = "host";
                    } else {
                        const rivalplayer = roomLobby.queryPlayerInRoom(id_room).find((rivalplayer) => rivalplayer.team !== player.team);
                        rivalplayer.role = "host";
                    }
                }
            }
            roomLobby.queryPlayerInRoom(id_room) = roomLobby.queryPlayerInRoom(id_room).filter((player) => player.id !== user_id);
            return { player, room, roomLobby };
        }
        return null;
    }

    async ready(user_id, id_room) {
        const room = roomLobby.findRoom(id_room);
        if (!room.isStart) {
            roomLobby.setReadyPlayer(id_room, user_id);
            return { isStart: false }
        } else {
            const idMap = room.idMap;
            try {
                const map = await mapService.getMapById(idMap);
                if (!map) {
                    return { error: "Map not found" };
                } else {
                    roomLobby.addNewPlayerToGame(id_room, user_id);
                    return { isStart: true, map: map }
                }
            } catch (err) {
                return { error: err };
            }
        }
    }

    cancelReady(user_id, id_room) {
        roomLobby.cancelReadyPlayer(id_room, user_id);
    }

    async getMapById(idMap) {
        return await mapService.getMapById(idMap);
    }

    async startGame(id_room, listPlayer) {
        const room = roomLobby.findRoom(id_room);
        const idMap = room.idMap;
        const map = await mapService.getMapById(idMap);
        if (!map) {
            return { error: "map not found" };
        } else {
            roomLobby.setAllPlayerReady(id_room);
            // console.log(id_room,"\n",listPlayer,"\n",map);
            roomLobby.createNewGame(id_room, listPlayer, map);
            return { map: map, idMap }
        }
    }

    updateStatePlayer(user_id, id_room, playing) {
        roomLobby.updateStatePlayer(user_id, id_room, playing);
    }

    updateGame(id_room) {
        roomLobby.updateGame(id_room);
    }

    getStateGame(id_room) {
        return roomLobby.getStateGame(id_room);
    }

    saveMatch(room_id, idMap) {
        const allStateGame = roomLobby.findRoom(room_id).engineGame.saveGame()
            .then((encodeAllStateGame) => {
                return encodeAllStateGame;
            })

        allStateGame.then((encodeAllStateGame) => {
            matchService.createMatch({ history: encodeAllStateGame, map_id: idMap, winnerTeam: "noTeam", endTime: new Date().getTime(), gameMode: "teamMatch" })
        });
    }

    controlTankTeamMatch(room_id, user_id, action, data) {
        // console.log(action)
        roomLobby.controlGame(room_id, user_id, action, data);
    }

    async kickPlayer(user_id, id_room) {
        const player = roomLobby.findPlayerInRoom(id_room, user_id);
        if (!player) {
            return { error: "Player not found" };
        }
        roomLobby.removePlayerInRoom(id_room, user_id);
        return { username: player.username, room: roomLobby.findRoom(id_room) };
    }

    async GetListUserLobby(user_id, nameRoom) {
        const listInforUserInLobby = await userService.getInforUserInRoom(nameRoom);
        const listFriend = await userService.getFriendInforUser(user_id);
        return { listInforUserInLobby, listFriend };
    }

    async inviteFriend(invitedPlayer_id, invitingPlayer_id) {
        const invitedSocket = userService.onlineSockets[invitedPlayer_id];
        const invitingSocket = userService.onlineSockets[invitingPlayer_id];
        if (!invitedSocket) {
            return { error: "Invited player is offline" };
        }

        const invitingPlayer_name = invitingSocket.request?.session?.username;

        const referer = invitingSocket.handshake.headers?.referer;

        if (!invitingPlayer_name || !referer) {
            return { error: "username or referer not found" }
        }

        const invitation = {
            invitorName: invitingPlayer_name,
            referer
        };
        return { invitation, invitedSocket };
    }

    async addFriend(sender_id, receiver_id) {
        const receiverSocket = userService.onlineSockets[receiver_id];
        const senderSocket = userService.onlineSockets[sender_id];
        try {
            const isUserInRequestSentList = await userService.checkUser_InFriendRequestSentList(receiver_id, sender_id);
            if (!isUserInRequestSentList) {
                userService.findByIdAndUpdate(sender_id, { $push: { friendRequestSentList: receiver_id } });
                userService.findByIdAndUpdate(receiver_id, { $push: { listFriend_request: sender_id } });
            }
            if (receiverSocket) {
                const senderName = senderSocket.request?.session?.username;
                return { senderName, receiverSocket };
            }
        } catch (err) {
            return { error: err };
        }
    }

    async updateFriend(sender_id, receiver_id) {
        userService.findByIdAndUpdate(receiver_id, { $push: { listFriend: sender_id } });
        userService.findByIdAndUpdate(sender_id, { $push: { listFriend: receiver_id } });
        userService.findByIdAndUpdate(sender_id, { $pull: { friendRequestSentList: receiver_id } });
        userService.findByIdAndUpdate(receiver_id, { $pull: { listFriend_request: sender_id } });
    }
}


module.exports = new roomService;