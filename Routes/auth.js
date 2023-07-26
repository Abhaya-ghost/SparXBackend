const express = require('express')
const router=express.Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

//generate jwt
const maxAge = 60*60*24*3
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: maxAge,
    })
}

//register
router.post('/register', asyncHandler(async(req,res) => {
    try {
        const {email,username,password} = req.body

        if(!username || !email || !password){
            res.status(400)
            throw new Error('Please add all fields')
        }
        //check if user exists
        const userExist=await User.findOne({email:req.body.email})
        if(userExist){
            res.status(400)
            throw new Error('User already exists')
        }

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
        const token = generateToken(user._id)
        res.status(200).json({user:user, token:token})
    } catch (error) {
        console.log(error)
    } 
}))


//login
router.post('/login', async(req,res) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json('Incorrect email')
        }

        const validPassword = bcrypt.compare(req.body.password, user.password)
        if(!validPassword){
            return res.status(400).json('Incorrect password')
        }

        const token = generateToken(user._id)
        res.status(200).json({user:user, token:token})
    } catch (error) {
        console.log(error)
    }
})


module.exports = router