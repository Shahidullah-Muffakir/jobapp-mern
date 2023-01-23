import {readFile} from 'fs/promises'
import connectDB from './db/connect.js'
import Job from './models/Job.js'

import dotenv from 'dotenv'
dotenv.config()

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        await Job.deleteMany()
        const jsonData=JSON.parse(
            await readFile(new URL('./mock-data.json',import.meta.url))
        )
        await Job.create(jsonData)
        console.log('success')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
start()