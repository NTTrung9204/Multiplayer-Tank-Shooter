const userDB = require("../models/User");
const mapDB = require("../models/Map");

class playController {
    // [GET] /play
    index(req, res) {
        res.render("gamemode", { username: req.session.username });
    }

    // [GET] /play/lobby
    async lobbyTeamMatch(req, res) {
        const user_id = req.session.user_id;
        const listmap = await mapService.getAllMapsNotDisabled();
        if (listmap.length === 0 || !listmap) {
            return res.redirect("/play");
        }
        res.render("lobby", { user_id, listmap, username: req.session.username });
    }

    // [GET] /play/lobby/:id_room
    async roomTeamMatch(req, res) {
        const user_id = req.session.user_id;
        const id_room = req.params.id_room;
        const user = await userService.findOneUserById(user_id);
        const listmap = await mapService.getAllMapsNotDisabled();
        const movementMode = userService.getMovementMode(user);
        const username = user.username;
        res.render("teamMatch/room", { user_id, id_room, username, listmap, movementMode });
    }
}

module.exports = new playController();
