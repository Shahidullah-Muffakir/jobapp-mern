import Express from 'express'
const router = Express.Router()

import { createJob, deleteJob, getAllJobs, updateJob, showStats } from '../controllers/jobsControllers.js'
import guestUser from '../middleware/guestUser.js'

router.route('/').post(guestUser,createJob).get(getAllJobs)
// place before :id
router.route('/stats').get(showStats)
router.route('/:id').delete(guestUser,deleteJob).patch(guestUser,updateJob)

export default router;