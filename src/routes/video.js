const router = require('express').Router()
const controller = require('../controllers/video.js')

router.get('/videos', controller.GET)
router.post('/videos', controller.POST)
router.put('/videos', controller.PUT)
router.delete('/videos', controller.DELETE)

module.exports = router