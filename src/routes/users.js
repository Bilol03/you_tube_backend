const router = require('express').Router()
const controller = require('../controllers/users.js')


router.get('/users', controller.GET)
// router.get('/users/:userId', controller.GET)


module.exports = router