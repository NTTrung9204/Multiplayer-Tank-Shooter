const express = require('express')
const router = express.Router()
const playController = require('../app/controllers/playController')

router.get('/', playController.index)
router.get('/lobby', playController.lobbyTeamMatch)
router.get('/lobby/:id_room', playController.roomTeamMatch)

module.exports = router