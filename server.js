import express from "express";
const app = express();
import morgan from "morgan";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';


import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';



//package for handling the async errors
import "express-async-errors";

// .env
import dotenv from "dotenv";
dotenv.config();

//routes
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

//    Middlewares imports
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import connectDB from "./db/connect.js";
import authenticateUser from "./middleware/auth.js";

// ===================External Middlewares=================================================================================================================
const __dirname = dirname(fileURLToPath(import.meta.url));


// app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(morgan("dev"));


// ===================Routes=================================================================================================================


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// ===================Internal Middlewares=================================================================================================================
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// ===================Listening to the Server=================================================================================================================
// ===================And connecting to mongoDB=================================================================================================================
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(er);
  }
};
start();
