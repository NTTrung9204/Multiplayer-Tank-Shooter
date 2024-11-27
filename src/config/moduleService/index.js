const utils = require('../../app/Utilities/utils');
const roomLobby = require('../../app/services/gameServices/roomLobby');
const mapRepository = require('../../app/repositories/mapRepository');
const matchService= require('../../app/services/controllerServices/matchService');
const mapService = require('../../app/services/controllerServices/mapService');
const userRepository = require('../../app/repositories/userRepository');
const loginService = require('../../app/services/controllerServices/loginService');
const userService = require('../../app/services/controllerServices/userService');
const rankService = require('../../app/services/controllerServices/rankService');
const profileService = require('../../app/services/controllerServices/profileService');
const registerService = require('../../app/services/controllerServices/registerService');
const settingsService = require('../../app/services/controllerServices/settingsService');
const apiServices = require('../../app/services/apiServices/apiServices');
const chatRepository = require('../../app/repositories/chatRepository');
const chatService = require('../../app/services/socketServices/chatService');


function configModuleService() {
    global.myUtils = utils;
    global.roomLobby = roomLobby;
    global.mapRepository = mapRepository;
    global.mapService = mapService;
    global.userRepository = userRepository;
    global.loginService = loginService;
    global.userService = userService;
    global.matchService = matchService;
    global.rankService = rankService;
    global.profileService = profileService;
    global.registerService = registerService;
    global.settingsService = settingsService;
    global.apiServices = apiServices;
    global.chatRepository = chatRepository;
    global.chatService = chatService;
}

module.exports = {configModuleService};