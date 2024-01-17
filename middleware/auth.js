const jwt = require("jsonwebtoken");
const User = require("../model/userSchema.js")
const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwtToken;
        // console.log(`in auth func : ${token}`);
        if(token){
            // console.log(token);
            const verifyUser = jwt.verify(token,process.env.SECRET);
            const user =await User.findOne({_id:verifyUser._id});
            req.token=token;
            req.user=user;
            // console.log(user.name);
            next();
        }
        else{
            res.send({
                success:false
              });
        }
        
        
    } catch (error) {
        res.status(500).send({
            error,
            success:false
        });
    }
}

module.exports = auth;