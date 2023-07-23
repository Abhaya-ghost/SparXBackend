const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const userRoute = require('./Routes/users')
const authRoute = require('./Routes/auth')
const postRoute = require('./Routes/posts')
const conversationRoute = require('./Routes/conversations')
const messageRoute = require('./Routes/messages')
const multer = require('multer')
const path =require('path')

const app =express()
dotenv.config()

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin",'*')
    res.header("Access-Control-Allow-Headers",'*')

    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods",'PUT,POST,DELETE,GET')
        return res.json({})
    }

    next()
})

app.use(helmet({
    crossOriginResourcePolicy: false,
}))

app.use('/images',express.static(path.join(__dirname,'/public/images')))


//middleware
app.use(express.json())


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname)
    }
})

const upload=multer({storage : storage})
app.post('/api/upload', upload.single('file'), (req,res) => {
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (error) {
        console.log(error)
    }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)

module.exports = app