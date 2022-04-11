const router = require('express').Router()
const controller = require('../controllers/auth.js')
const validateToken = require('../middlewares/checkToken.js')


router.post('/login', controller.LOGIN)
router.post('/register', controller.REGISTER)
router.get('/validateToken', validateToken, controller.VALIDATE_TOKEN)

module.exports = router