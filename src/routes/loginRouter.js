const express = require('express')
const router = express.Router()
const LoginController = require('../app/controllers/LoginController')

router.get('/', LoginController.index)
router.post('/',LoginController.loginUser)

module.exports = router