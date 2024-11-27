const roomLobby = require("../services/gameServices/roomLobby");
const roomSocket = require("./roomSocket");
const lobbySocket = require("./lobbySocket");
const userService = require("../services/controllerServices/userService");
const chatCommunitySocket = require("./chatCommunitySocket");

class Socket {
    connection(socket) {
        lobbySocket.connection(socket);
        roomSocket.connection(socket);
        chatCommunitySocket.connection(socket);

        // Luôn lưu user_id vào socket để dễ dàng truy xuất từ socket_id sang user_id và ngược lại
        // Thay vì phải lưu vào từng trang riêng lẻ (lobby, room)
        if (socket?.request?.session?.user_id) {
            const user_id = socket.request.session.user_id;
            socket.user_id = user_id;

            userService.onlineSockets[user_id] = socket;
        }

        socket.on("disconnect", () => {//m->done
            const referer = socket.handshake.headers.referer;
            const room_id = referer.split("/")[referer.split("/").length - 1];
            const user_id = socket.user_id;

            // xoá socket khỏi danh sách online
            delete userService.onlineSockets[user_id];

            if (!(room_id === "lobby")) {
                const player = roomLobby.findPlayerInRoom(room_id, user_id);
                if (!player) {
                    return;
                }
                if (roomLobby.getQuantityPlayerInRoom(room_id) > 1) {
                    if (player.role === "host") {
                        const nextHost = roomLobby.findNextPlayerInTeam(room_id, player.team, user_id);
                        if (nextHost) {
                            nextHost.role = "host";
                        } else {
                            const rivalPlayer = roomLobby.findRivalPlayerInRoom(room_id, player);
                            rivalPlayer.role = "host";
                        }
                    }
                }
                if (!roomLobby.getRoomState(room_id)) {
                    roomLobby.removePlayerInRoom(room_id, user_id);
                    userService.setUserInGame(user_id, false);
                } else {
                    roomLobby.updateStatePlayer(user_id, room_id, false);
                }
                _io.to(room_id).emit("Server__UpdateRoom__Room", roomLobby.findRoom(room_id));
                _io.to(room_id).emit("Server__ExitRoom__Room", player.username, player.id);
            }
        });

    }
}

module.exports = new Socket();