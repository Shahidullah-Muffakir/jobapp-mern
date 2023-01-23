// import { StatusCodes } from "http-status-codes"

// const errorHandlerMiddleware= (err,req,res,next)=>{
//     const defaultError={
//         statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,     //INTERNAL_SERVER_ERROR-->500
//         message:err.message||'Something went wrong, try again later.'
//     }
//     if(err.name==='ValidationError'){
//         defaultError.statusCode=StatusCodes.BAD_REQUEST // BAD_REQUIEST -->400
//         defaultError.message=Object.values(err.errors).map((item)=>item.message).join(',')
//     }
//     if(err.code && err.code===11000){
//         defaultError.statusCode=StatusCodes.BAD_REQUEST // BAD_REQUIEST -->400
//         defaultError.message=`${Object.keys(err.keyValue)} field has to be unique `

//     }
//     res.status(defaultError.statusCode).json({msg:defaultError.message})

// }

// export default errorHandlerMiddleware

import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  }
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    // defaultError.msg = err.message
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware