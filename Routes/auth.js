const express = require('express')
const router=express.Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')

//register
router.post('/register', async(req,res) => {
    try {
        //encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password,salt)

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
        })

        //save user and return response
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    } 
})


//login
router.post('/login', async(req,res) => {
    try {
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("incorrect password")

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router