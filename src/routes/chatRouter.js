const express = require('express')
const router = express.Router()
const chatController = require('../app/controllers/chatController')

router.get('/', chatController.index)

module.exports = router