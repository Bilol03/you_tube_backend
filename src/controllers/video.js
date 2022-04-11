const { verify } = require('../utils/jwt')
const { ValidationError } = require('../utils/error.js')
const path = require('path')


const POST = (req, res) => {
    try {
        let size = req.files.videoUrl.size / 1024 / 1024
        if(size > 50) {
            ValidationError("Video size must not be higher than 50mb")
        }
        
        const videos = req.readFile('video') || []
        
        let date = new Date()

        req.body.videoId = videos.length ? videos.at(-1).videoId + 1 : 1
        req.body.videoId = req.body.userId
        req.body.videoTitle = req.body.videoTitle
        req.body.videoUrl = '/video/' + req.files.videoUrl.name
        req.body.videoSize = req.files.videoUrl.size / 1024 / 1024 + "mb" 
        req.body.videoUploadedDate = date

        const file = req.files.videoUrl

        const paths = path.join(process.cwd(), 'src', 'database', 'video')
        file.mv(paths + "/" + file.name, (err) => {
            if (err) {
                console.log(err);
              return res.status(500).send(err);
            }
        });

        

        videos.push(req.body)
        req.writeFile('video', videos)


        return res.status(201).json({
            status: 201,
            message: 'The video successfully uploaded!',
            status: "success", 
            path: paths + "/" + file.name
        })
    } catch(error) {
        console.log(error)
    }
}



const GET = (req, res) => {
    let videos = req.readFile("video")  
    res.send(videos || [])  
}



const VERIFY = (req, res) => {
    token = req.body
    verify(token)
}

module.exports = {
    POST,
    GET,
    VERIFY,
}