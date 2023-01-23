import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, UnauthenticatedError } from "../errors/index.js";



//=====Register a User==============================================================================
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Provide all the values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError(
      "This Email is already used once, try a different Email"
    );
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
      },
      token,
      location: user.location,
    }); //CREATED -->201
};
//=================================================================================================

//=====Login User==============================================================================

const login = async (req, res) => {
const {email,password}=req.body;

if(!email||!password){
   throw new BadRequestError('Please provide all the values')
}

const user = await User.findOne({ email }).select('+password')

if(!user){
  throw new UnauthenticatedError('Invalid credentials')
}

const isPasswordCorrect= await user.comparePassword(password)

if(!isPasswordCorrect){
  throw new UnauthenticatedError('Invalid credentials')
}

const token=user.createJWT()
user.password=undefined
res.status(StatusCodes.OK).json({user,token,location:user.location})
};


//=====Update User==============================================================================
const updateUser = async (req, res) => {
  const {name,email,lastName,location}=req.body;
  if(!name||!email||!lastName||!location){
    throw new BadRequestError('Please provide all the values')
  }
  const user=await User.findOne({_id:req.user.userId})

  user.name=name;
  user.email=email;
  user.lastName=lastName;
  user.location=location;

  await user.save()
  const token=user.createJWT()
  res.status(StatusCodes.OK).json({user,location:user.location,token})
};

export { register, login, updateUser };
