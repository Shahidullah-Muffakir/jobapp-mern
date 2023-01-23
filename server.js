import Express from "express";
const app = Express();
import morgan from "morgan";

import { dirname, resolve } from "path";
import path from "path";
import { fileURLToPath } from "url";

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

app.use(Express.static(path.resolve(__dirname, "./client/build")));
app.use(Express.json());
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(morgan("dev"));


// ===================Routes=================================================================================================================
app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});
app.get("/api/v1", (req, res) => {
  res.json({ msg: "welcome" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.get("*", (req, res) => {
  res.sendFile(resolve.path(__dirname, "./client/build", "index.html"));
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
