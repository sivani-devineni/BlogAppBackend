const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    require: true,
  },
  tokens:[
    {
      token:{
        type: String,
        require: true,
      }
    }
  ]
});

userSchema.pre("save", async function (next) {
  // console.log("hii from hash");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken=async function(){
  try{
    let jwttoken=jwt.sign({_id:this.id},process.env.SECRET,{});
    this.tokens=this.tokens.concat({token:jwttoken});
    await this.save();
    return jwttoken;
  }catch(err){
    console.log(err);
  }

}

const User = new mongoose.model("USER", userSchema);

module.exports = User;