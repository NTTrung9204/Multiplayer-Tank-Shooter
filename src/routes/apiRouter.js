const express = require('express')
const router = express.Router()
const apiController = require('../app/controllers/apiController')
const settingApi = require('../app/apis/settingApi')
const chatCommunityApi = require('../app/apis/chatCommunityApi')

router.get('/user/:_id', apiController.getUserById)
router.get('/message', apiController.getMessage)
router.get('/friends/:_id',apiController.getFriendList)
router.patch('/user/saveMovementMode', settingApi.saveSetting)
router.get('/chatCommunity', chatCommunityApi.getChatCommunity)

module.exports = router