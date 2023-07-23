const router = require('express').Router()
const Conversation = require('../Models/Conversation')

//new convo
router.post('/', async(req,res) => {
    const newConversation = new Conversation({
        member:[req.body.senderId,req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get convvo of a user
router.get('/:userId', async(req,res) => {
    try {
        const conversation = await Conversation.find({
            member:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get convo includes 2 userid
router.get('/find/:firstUserId/:secondUserId', async(req,res) => {
    try {
        const convo = await Conversation.findOne({
            member:{$all:[req.params.firstUserId,req.params.secondUserId]}
        })
        res.status(200).json(convo)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router