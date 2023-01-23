import Express from 'express'
const router=Express.Router()

import { register, login, updateUser } from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'

import rateLimiter from 'express-rate-limit'
 import guestUser from '../middleware/guestUser.js'

const apiLimiter=rateLimiter({
    windowMs:15*60*1000,
    max:10 ,
    message:'Too many request from this IP address, please try again after 15 minutes'
  })

router.route('/register').post(apiLimiter,register)
router.route('/login').post(apiLimiter,login)
router.route('/updateUser').patch(authenticateUser,guestUser,updateUser)

export default router;