const EngineGame = require("./engineGameServer");

/*
    class RoomLobby{
        rooms: [
            id: id của room
            nameRoom: tên của room
            isStart: trạng thái của room // true: đã bắt đầu, false: chưa bắt đầu
            password: mật khẩu của room
            nameMap://
            idMap: //
            players: [
                {
                    id: id của player
                    score: 0,
                    kills: 0,
                    deaths:0,
                    username: tên của player
                    role: vai trò của player // Có phải chủ phòng hay không
                    team: team của player // team Chó hoặc mèo
                    avatar: avatar của player
                    isReady: trạng thái sẵn sàng của player // true: đã sẵn sàng, false: chưa sẵn sàng
                    playing:
                }
            ]
            engineGame: // engine game của room
        ]

        findPlayerInRoom(player_id): Tìm player trong room theo id của player
        findRoom(id_room): Tìm room theo id của room
        getQuantityPlayerInRoom(id_room): Lấy số lượng player trong room
        queryPlayerInTeam(room, team): Tìm player trong team
        findNextPlayerInTeam(id_room, team, player_id): Tìm player tiếp theo trong team
        findRivalPlayerInRoom(id_room, player): Tìm player đối thủ trong room
        removePlayerInRoom(id_room, player_id): Xóa player trong room
  
    }
*/

class roomLobby {
    constructor() {
        this.rooms = [];
        this.MAX_PLAYER_IN_ROOM = 8;
    }

    findPlayerInRoom(room_id, player_id) {
        const room = this.findRoom(room_id);
        if (!room) {
            return null;
        }
        return room.players.find((player) => player.id === player_id);
    }

    findRoom(id_room) {
        return this.rooms.find((room) => room.id === id_room);
    }

    getQuantityPlayerInRoom(id_room) {
        // ?. là optional chaining (toán tử truy xuất an toàn)
        // Nếu object là null hoặc undefined thì trả về undefined khi truy xuất thuộc tính
        return this.findRoom(id_room)?.players?.length;
    }

    queryPlayerInTeam(room_id, team) {
        const room = this.findRoom(room_id);
        if (!room) {
            console.log("Room not found or not exist");
            return;
        }
        const playerInTeam = room.players.filter((player) => player.team === team);
        return playerInTeam;
    }

    queryPlayerInRoom(room_id) {
        const room = this.findRoom(room_id);
        if (!room) {
            console.log("Room not found or not exist");
            return;
        }
        return room.players;
    }

    findNextPlayerInTeam(id_room, team, player_id) {
        const room = this.findRoom(id_room);

        const nextPlayer = room.players.find((player) => player.team === team && player.id !== player_id);

        return nextPlayer;
    }

    findRivalPlayerInRoom(id_room, player) {
        const room = this.findRoom(id_room);
        const rivalPlayer = room.players.find((p) => p.team !== player.team);
        return rivalPlayer;
    }

    removePlayerInRoom(id_room, player_id) {
        const room = this.findRoom(id_room);
        const index = room.players.findIndex((player) => player.id === player_id);
        room.players.splice(index, 1);
        if (room.players.length === 0) {
            const indexRoom = this.rooms.findIndex((room) => room.id === id_room);
            this.rooms.splice(indexRoom, 1);
        }
    }

    addNewRoom(roomObject) {
        this.rooms.push(roomObject);
    }

    addNewPlayerToRoom(id_room, playerObject) {
        const room = this.findRoom(id_room);
        room.players.push(playerObject);
    }

    getQuantityRoom() {
        return this.rooms.length;
    }

    createNewGame(id_room, listPlayer, map) {
        const room = this.findRoom(id_room);
        const tankSize = 50;
        room.engineGame = new EngineGame(map);
        room.isStart = true;
        
        listPlayer.forEach((player) => {
            // Tính toán vị trí xuất phát của tank
            // Bởi vì nhà chó và nhà mèo có kích thước 100x100 => có thể chia nhỏ thành 4 phần
            const xSide = myUtils.getRandomNumber(0, 1);
            const ySide = myUtils.getRandomNumber(0, 1);
            const homeX = player.team === "cat" ? map.catPosition.x : map.dogPosition.x;
            const homeY = player.team === "cat" ? map.catPosition.y : map.dogPosition.y;
            const xStart = homeX + xSide * tankSize;
            const yStart = homeY + ySide * tankSize;

            room.engineGame.addTank(player.id, xStart, yStart, player.team, player.username);
        });

        const firseState = room.engineGame.tanks;
        const encodeFirseState = myUtils.encodeData(firseState);
        room.engineGame.stateGame.push(encodeFirseState);
    }

    updateGame(id_room) {
        const room = this.findRoom(id_room);
        // console.log("Số người chơi trong room: ",room.players.length);
        room.engineGame.updateState();
    }

    getStateGame(id_room) {
        const room = this.findRoom(id_room);
        return room.engineGame.getState();
    }

    getLeaderBoard(id_room) {
        const room = this.findRoom(id_room);
        return room.engineGame.getLeaderboard();
    }

    controlGame(id_room, player_id, action, data) {
        const room = this.findRoom(id_room);
        if (!room) {
            return;
        }
        room.engineGame.controlTank(player_id, action, data);
    }

    getQuantityRoom() {
        return this.rooms.length;
    }

    getQuantityPlayerInTeamCat(id_room) {
        const room = this.findRoom(id_room);
        const catTeam = room.players.filter((player) => player.team === "cat");
        return catTeam.length;
    }

    getQuantityPlayerInTeamDog(id_room) {
        const room = this.findRoom(id_room);
        const dogTeam = room.players.filter((player) => player.team === "dog");
        return dogTeam.length;
    }

    setReadyPlayer(id_room, player_id) {
        const player = this.findPlayerInRoom(id_room, player_id);
        player.isReady = true;
    }

    cancelReadyPlayer(id_room, player_id) {
        const player = this.findPlayerInRoom(id_room, player_id);
        player.isReady = false;
    }

    setAllPlayerReady(id_room) {
        const room = this.findRoom(id_room);
        room.players.forEach((player) => {
            player.isReady = true;
        });
    }

    addNewPlayerToGame(id_room, player_id) {
        const room = this.findRoom(id_room);
        const player = room.players.find((player) => player.id === player_id);
        const tankSize = 50;
        const xSide = myUtils.getRandomNumber(0, 1);
        const ySide = myUtils.getRandomNumber(0, 1);
        const homeX = player.team === "cat" ? room.engineGame.map.catPosition.x : room.engineGame.map.dogPosition.x;
        const homeY = player.team === "cat" ? room.engineGame.map.catPosition.y : room.engineGame.map.dogPosition.y;
        const xStart = homeX + xSide * tankSize;
        const yStart = homeY + ySide * tankSize;

        room.engineGame.addTank(player_id, xStart, yStart, player.team, player.username);
    }

    checkFullPlayer(id_room) {
        return this.getQuantityPlayerInRoom(id_room) === this.MAX_PLAYER_IN_ROOM;
    }

    getRoomState(id_room) {
        const room = this.findRoom(id_room);
        return room.isStart;
    }

    updateStatePlayer(user_id, id_room, playing) {
        const room = this.findRoom(id_room);
        const player = room.players.find((player) => player.id === user_id);
        player.playing = playing;
    }

    calculateTeamScore(id_room, team) {
        const room = this.findRoom(id_room);
        const teamPlayers = room.players.filter((player) => player.team === team);
        let score = 0;
        teamPlayers.forEach((player) => {
            score += player.score;
        });
        return score;
    }
 
    isPlayerAlive(id_room, player_id) {
        const room = this.findRoom(id_room);
        const player = room.players.find((player) => player.id === player_id);
        return player.playing;
    }

    getPlayerScore(id_room, player_id) {
        const room = this.findRoom(id_room);
        const player = room.players.find((player) => player.id === player_id);
        return player.score;
    }

    setAllPlayerPlaying(id_room) {
        const room = this.findRoom(id_room);
        room.players.forEach((player) => {
            player.playing = true;
        });
    }


}

module.exports = new roomLobby();
