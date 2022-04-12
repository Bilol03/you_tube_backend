const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const fileUpload = require('express-fileupload')
const cors = require('cors')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/img', express.static(path.join(__dirname, "database", "img")))
app.use('/video', express.static(path.join(__dirname, "database", "video")))


app.use(express.json())


require('./config.js')

const modelMiddleware = require('./middlewares/model.js')
app.use(modelMiddleware({ databasePath: path.join(__dirname, 'database')}))


const authRoute = require('./routes/auth.js')
const userRoute = require('./routes/users.js')
const videoRoute = require('./routes/video.js')

app.use(authRoute)
app.use(userRoute)
app.use(videoRoute)



app.listen(PORT, () => console.log("This server is running on http://192.168.30.34:" + PORT))