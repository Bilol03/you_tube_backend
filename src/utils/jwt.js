const JWT = require('jsonwebtoken')

module.exports = {
    sign: payload => JWT.sign(payload, process.env.SECRET_KEY),
    verify: token => JWT.verify(token, process.env.SECRET_KEY),
}