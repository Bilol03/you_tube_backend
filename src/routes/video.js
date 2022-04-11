const router = require('express').Router()
const controller = require('../controllers/video.js')

router.get('/videos', controller.GET)
router.post('/videos', controller.POST)

module.exports = router