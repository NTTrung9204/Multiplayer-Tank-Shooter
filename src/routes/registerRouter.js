const express = require('express')
const router = express.Router()
const RegisterController = require('../app/controllers/RegisterController')

router.get('/', RegisterController.index)
router.post('/', RegisterController.registerUser)

module.exports = router