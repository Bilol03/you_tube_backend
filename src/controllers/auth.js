const { AuthorizationError, InternalServerError } = require('../utils/error.js')
const { sign } = require('../utils/jwt.js')
const sha256 = require('sha256')
const path = require('path')


const LOGIN = (req, res, next) => {
    try {
        const users = req.readFile('users') || []

        req.body.password = sha256(req.body.password)
        const user = users.find(user => user.username == req.body.username && user.password == req.body.password)

        if (!user) {
            return next(
                new AuthorizationError(400, 'Wrong username or password!')
            )
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        return res.status(200).json({
            status: 200,
            message: 'The user successfully logged in!',
            img: user.userImg,
            token: sign({ agent, ip, userId: user.userId })
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const REGISTER = (req, res, next) => {
    try {
        const users = req.readFile('users') || []
        
        
        req.body.userId = users.length ? users.at(-1).userId + 1 : 1
        req.body.username = req.body.username
        req.body.password = sha256(req.body.password)
        req.body.userImg = '/img/' + req.files.userImg.name
        const file = req.files.userImg
        
        console.log(req.body);
        const paths = path.join(process.cwd(), 'src', 'database', 'img')
        file.mv(paths + "/" + file.name, (err) => {
            if (err) {
                console.log(err);
              return res.status(500).send(err);
            }
        });

        if (users.find(user => user.username == req.body.username)) {
            return next(
                new AuthorizationError(400, 'The user already exists')
            )
        }
        
        users.push(req.body)
        req.writeFile('users', users)

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']
    
        return res.status(201).json({
            status: 201,
            message: 'The user successfully registered!',
            img: req.body.userImg,
            token: sign({ agent, ip, userId: req.body.userId }),
            status: "success", 
            path: paths + "/" + file.name
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const VALIDATE_TOKEN = (req, res) => {
    return res.status(200).json({
		isValid: true,
		message: "Token is valid!"
	})
}

module.exports = {
    LOGIN,
    REGISTER,
    VALIDATE_TOKEN
}