const express = require('express')
const router = express.Router()
const LogoutController = require('../app/controllers/LogoutController')

router.get('/', LogoutController.index)

module.exports = router