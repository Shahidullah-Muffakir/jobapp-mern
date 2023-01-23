import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minlength:3,
        maxlength:20,
        trim:true,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        unique:true,
        validate:{
        validator:validator.isEmail,
        message:'Please provide a valid email'
       }

    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6,
        select:false
    },
    lastName:{
        type:String,
        maxlength:20,
        trim:true,
        default:'last name'
    },
    location:{
        type:String,
        maxlength:20,
        trim:true,
        default:'my city'
    },

})

//mongoose middleware
//hashing the password of every document we create from UserSchema before saving using bcryptjs
UserSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
}) 


//creating instance method, for creating JWT
UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

//creating an instance method to verify the password
UserSchema.methods.comparePassword=async function (candidatePassword){
   const isMatch=await bcrypt.compare(candidatePassword,this.password)
   return isMatch
}


//we are creating User Model, the users collection will be automatically created in the db.
const User=mongoose.model('User',UserSchema)

export default User