const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./Routes/users')
const authRoute = require('./Routes/auth')
const postRoute = require('./Routes/posts')
const conversationRoute = require('./Routes/conversations')
const messageRoute = require('./Routes/messages')
const multer = require('multer')
const path =require('path')
const cookieParser  = require('cookie-parser')
const requireAuth = require('./middleware/authMiddleware')

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

app.use('/images',express.static(path.join(__dirname,'/public/images')))


app.use(express.json())
app.use(cookieParser())

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

app.use('/api/users', requireAuth,userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', requireAuth,postRoute)
app.use('/api/conversations',requireAuth, conversationRoute)
app.use('/api/messages',requireAuth, messageRoute)

module.exports = app