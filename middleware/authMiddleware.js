const jwt = require('jsonwebtoken')

module.exports = async(req,res,next) => {
    const token=req.headers.authorization
    console.log(token)
    //check jwt exist
    if(token){
        jwt.verify(token,process.env.JWT_SECRET, (err,decodedToken) => {
            if(err){
                console.log(err.message)
                res.status(401)
            }
            else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        return res.status(401).json({
            msg:'Not Authorized'
        })
    }
}
