const express = require('express')
const router = express.Router()
const HomePageController = require('../app/controllers/HomePageController')

router.get('/', HomePageController.index)

module.exports = router