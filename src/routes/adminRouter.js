const express = require('express')
const router = express.Router()
const adminController = require('../app/controllers/adminController')

router.get('/', adminController.index)
router.get('/map', adminController.map)
router.get('/map/edit/:id', adminController.editLayout)
router.post('/map/edit/:id', adminController.editMap)
router.get('/map/create', adminController.createLayout)
router.post('/map/create', adminController.createMap)



module.exports = router