const userDB = require("../models/User");
const settingsService = require("../services/controllerServices/settingsService");

class settingsController {
    // [GET] /play
    async index(req, res) {
        const user_id = req.session.user_id;
        const username = req.session.username;

        const { isRotateMode, isFreeMode } = await settingsService.settingMovementModeHandler(user_id);
        res.render('setting/setting', { isRotateMode, isFreeMode, username });
    }

}

module.exports = new settingsController