const model = require("../middlewares/model")

const GET = (req, res) => {
    const { userId } = req.params

    let users = req.readFile('users') 
    users = users.map(user => {
        delete user.password
        user.userCreatedAt = new Date().toDateString().slice(0, 10)
        return user
    })

    if(userId) {
        let user = users.find(el => el.userId == userId)
        res.send(user)
    }

    res.send(users)

   
}

module.exports ={
    GET
}