const http=require('http')
const app =require('./app')
const { default: mongoose } = require('mongoose')
const PORT = process.env.PORT || 8000
const server = http.createServer(app)

const io = require('socket.io')(server, {
    cors:{
        origin:'*'
    }
})

mongoose.connect(process.env.MONGO_URL)
 .then(() => server.listen(PORT, () => {
    console.log(`Server started on ${PORT} and mongodb connected`);
})) 

let users = []

const addUser = (userId,socketId) => {
    !users.some(user => user.userId === userId) && 
       users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users=users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) =>{
    return users.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
    //when connected
    console.log('a user connected')

    //take userId and socketId from user
    socket.on('addUser', userId => {
        addUser(userId,socket.id)
        io.emit('getUsers',users)
    })

    //send and get message
    socket.on('sendMessage',({senderId,receiverId,text}) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit('getMessage',{
            senderId,
            text
        })
    })

    //when disconnected
    socket.on('disconnect', () => {
        console.log('User disconnected')
        removeUser(socket.id)
        io.emit('getUsers',users)
    })
})