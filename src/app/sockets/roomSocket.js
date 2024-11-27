const roomService = require("../services/socketServices/roomService");

class roomSocket {
    connection(socket) {
        socket.on("Room__ChangeMap__Server", (room_id, idMap) => {
            try {
                const room = roomService.changeMap(room_id, idMap);
                if (room) {
                    _io.to(room_id).emit("Server__UpdateRoom__Room", room);
                }
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("Room__ChangeTeam__Server", (user_id, room_id) => {
            const room = roomService.changeTeam(user_id, room_id);
            if (room) {
                _io.to(room_id).emit("Server__UpdateRoom__Room", room);
            }
        });

        socket.on("Room__ConnectToTeamMatch__Server", (user_id, id_room) => {
            socket.join(id_room);
            roomService.connectToTeamMatch(user_id, id_room)
                .then(({ success, ready, rooms, room, message }) => {
                    if (success) {
                        if (ready) {
                            _io.to("teamMatch").emit("Server__UpdateLobby__Lobby", rooms);
                            _io.to(id_room).emit("Server__UpdateRoom__Room", room);
                        } else {
                            _io.to(id_room).emit("Server__UpdateRoom__Room", room);
                        }
                    } else {
                        socket.emit("Server__ConnectToRoomFail__Room", { message: message });
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        });

        socket.on("Room__SendMessage__Server", (message, user_id, id_room) => {
            const player = roomService.sendMessage(id_room, user_id);
            if (player) {
                _io.to(id_room).emit("Server__SendMessage__Room", message, player.username, player.team, player.avatar);
            }
        });

        socket.on("Room__Ready__Server", (user_id, id_room) => {
            roomService.ready(user_id, id_room)
                .then(({ error, isStart, map }) => {
                    if (!error) {
                        if (!isStart) {
                            _io.to(id_room).emit("Server__Ready__Room", user_id);
                        } else {
                            socket.emit("Server__StartGame__Room", map);
                        }
                    } else {
                        console.log(error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        socket.on("Room__CancelReady__Server", (user_id, id_room) => {
            roomService.cancelReady(user_id, id_room);
            _io.to(id_room).emit("Server__CancelReady__Room", user_id);
        });

        socket.on("Room__StartGame__Server", async (id_room, listPlayer) => {
            roomService.startGame(id_room, listPlayer)
                .then(({ error, map, idMap }) => {
                    if (!error) {
                        _io.to(id_room).emit("Server__StartGame__Room", map);

                        socket.on("Room__LoadingComplete__Server", (user_id) => {
                            roomService.updateStatePlayer(user_id, id_room, true);

                            setInterval(() => {
                                roomService.updateGame(id_room);
                                const encodeState = roomService.getStateGame(id_room);
                                console.log(encodeState.length);
                                _io.to(id_room).emit("Server__ControlTankTeamMatch__Room", encodeState);
                            }, 1000 / 40);
                        
                            // roomService.saveMatch(id_room, idMap);
                        });
                    } else {
                        console.log(error);
                    }
                })
        });

        socket.on("Room__ControlTankTeamMatch__Server", (user_id, action, data, room_id) => {
            roomService.controlTankTeamMatch(room_id, user_id, action, data);
        });

        socket.on("Room__KickPlayer__Server", (user_id, id_room) => {
            roomService.kickPlayer(user_id, id_room)
                .then(({ error, username, room }) => {
                    if (!error) {
                        _io.to(id_room).emit("Server__UpdateRoom__Room", room);
                        _io.to(id_room).emit("Server__KickPlayer__Room", { _id: user_id, username: username });
                        socket.emit("Server__KickPlayerResult__Room", { message: "Kick player success" });
                    } else {
                        console.log(error);
                    }
                })
        });

        socket.on("Room__GetListUserLobby__Server", (user_id) => {
            roomService.GetListUserLobby(user_id, "teamMatch")
                .then(({ listInforUserInLobby, listFriend }) => {
                    socket.emit("Server__GetListUserLobby__Room", listInforUserInLobby, listFriend);
                })
        });

        socket.on("Room__InviteFriend__Server", (invitedPlayer_id, invitingPlayer_id) => {
            roomService.inviteFriend(invitedPlayer_id, invitingPlayer_id)
                .then(({ error, invitation, invitedSocket }) => {
                    if (!error) {
                        invitedSocket.emit("Server__InviteFriend__Client", invitation);

                    } else {
                        console.log(error);
                    }
                });
        });

        socket.on("Room__AddFriend__Server", async (sender_id, receiver_id) => {
            roomService.addFriend(sender_id, receiver_id)
                .then(({ senderName, error, receiverSocket }) => {
                    if (!error) {
                        receiverSocket.emit("Server__AddFriend__Client", senderName, async (response) => {
                            if (response.isAccepted) {
                                roomService.updateFriend(sender_id, receiver_id);
                            } else {
                                console.log("Friendship request rejected.");
                            }
                        });
                    } else {
                        console.log(error);
                    }
                });
        });
    }
}

module.exports = new roomSocket();