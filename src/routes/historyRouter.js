const express = require('express')
const router = express.Router()
const HistoryController = require('../app/controllers/HistoryController')

router.get('/', HistoryController.index)

module.exports = router