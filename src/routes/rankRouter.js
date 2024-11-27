const express = require('express')
const router = express.Router()
const rankController = require('../app/controllers/rankController')

router.get('/:page', rankController.index)

module.exports = router