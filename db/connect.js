import mongoose from 'mongoose'
mongoose.set('strictQuery', true);

//this function returns a promise
const connectDB=(url)=>{
    mongoose.connect(url)
    console.log('connected to mongoDB Successfully')

}
 
export default connectDB
