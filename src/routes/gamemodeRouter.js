const express = require('express')
const router = express.Router()
const GameModeController = require('../app/controllers/GameModeController')

router.get('/', GameModeController.index)

module.exports = router