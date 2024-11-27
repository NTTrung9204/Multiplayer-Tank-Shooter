const express = require('express')
const router = express.Router()
const replayController = require('../app/controllers/replayController')

router.get('/', replayController.index)

module.exports = router