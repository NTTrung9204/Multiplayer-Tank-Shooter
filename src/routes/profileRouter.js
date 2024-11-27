const express = require('express')
const router = express.Router()
const ProfileController = require('../app/controllers/ProfileController')

router.get('/:username', ProfileController.index)
router.post('/upload', ProfileController.uploadImage)
module.exports = router