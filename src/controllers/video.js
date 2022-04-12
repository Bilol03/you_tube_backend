const { verify } = require('../utils/jwt')
const { ValidationError, ClientError } = require('../utils/error.js')
const path = require('path')
const fs = require('fs')

const GET = (req, res) => {
    let videos = req.readFile("video")  
    res.send(videos || [])  
}

const POST = (req, res) => {
    try {
        let size = req.files.videoUrl.size / 1024 / 1024
        if(size > 50) {
            ValidationError("Video size must not be higher than 50mb")
        }
        
        const videos = req.readFile('video') || []
        
        let date = new Date()

        req.body.videoId = videos.length ? videos.at(-1).videoId + 1 : 1
        req.body.userId = req.body.userId
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


const PUT = (req, res) => {
	let { videoId, videoTitle } = req.body
	videoTitle = videoTitle.trim()
	if(!videoId) {
		throw new ClientError(400, "videoId is required!")
	}
	if(videoTitle.length < 1) {
		throw new ClientError(400, "videoTitle is required!")
	}
	if(videoTitle.length > 30) {
		throw new ClientError(413, "videoTitle is too long!")
	}
	const videos = req.readFile('video')
	const found = videos.find(video => video.videoId == videoId)
	if(!found) {
		throw new ClientError(404, "There is no such video!")
	}
	found.videoTitle = videoTitle
	req.writeFile('video', videos)
	return res.status(201).json({
		video: found,
		message:"The video updated!"
	})

}


const DELETE = (req, res) => {
    let { videoId } = req.body

    if(!videoId) {
        throw new ClientError(400, "videoId is required!")
    }

    const videos = req.readFile('video')
    const found = videos.findIndex(video => video.videoId == videoId)

    if(found == -1) {
        throw new ClientError(404, "There is no such video!")
    }

    const [ deletedVideo ] = videos.splice(found, 1)
    fs.unlinkSync(path.join(process.cwd(), "src", "database", deletedVideo.videoUrl))

    req.writeFile('video', videos)

    return res.status(201).json({
        video: deletedVideo,
        message:"The video is deleted!"
    })
}




const VERIFY = (req, res) => {
    token = req.body
    verify(token)
}

module.exports = {
    POST,
    GET,
    PUT,
    DELETE,
    VERIFY,
}