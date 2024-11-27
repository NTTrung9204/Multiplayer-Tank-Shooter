const lobbyService = require("../services/socketServices/lobbyService");

class lobbySocket {
    connection(socket) {
        socket.on("Lobby__ConnectToLobby__Server", (user_id) => {//m->done
            socket.join("teamMatch");
            socket.emit("Server__UpdateLobby__Lobby", lobbyService.getRooms());
        });

        socket.on("Lobby__CreateRoomTeamMatch__Server", (user_id, idMap, passwordRoom) => {//m->done
            lobbyService.createRoomTeamMatch(user_id, idMap, passwordRoom)
                .then(({ error, room_id, nameMap }) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const message = {
                            status: "success",
                            title: "Tạo phòng thành công",
                            content: `Map: ${nameMap} đã được tạo thành công`
                        }
                        // save message to session
                        socket.request.session.message = message;
                        socket.request.session.save();
                        socket.emit("Server__CreateRoomSuccess__Lobby", room_id);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        });

        socket.on("Lobby__ConfirmPassword__Server", (idRoom, password, callback) => {//m->done
            callback({ success: lobbyService.confirmPassword(idRoom, password) });
        });

        socket.on("Lobby__JoinRoomTeamMatch__Server", (user_id, callback) => {//m->done
            lobbyService.getStatusUser(user_id)
                .then(({ inGame }) => {
                    callback({ inGame });
                })
                .catch(err => {
                    console.log(err);
                })
        });
    }

}
module.exports = new lobbySocket();