class GameModeController {
    index(req, res) {
        res.render('gamemode')
    }
}

module.exports = new GameModeController