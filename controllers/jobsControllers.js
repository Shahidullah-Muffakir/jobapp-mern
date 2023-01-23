import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import Job from "../models/Job.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

//=====Create a new job==============================================================================
const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("please provide all the values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
//===================================================================================

//=====Getting all the jobs==============================================================================
const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let result = Job.find(queryObject);
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs, numOfPages});
};
//===================================================================================

//=======Update a Job============================================================================
const updateJob = async (req, res) => {
  const { id: JobId } = req.params;
  const { company, position } = req.body;

  if ((!company, !position)) {
    throw new BadRequestError("please provide all the values");
  }
  const job = await Job.findById(JobId);
  if (!job) {
    throw new NotFoundError(`No job found with id :${JobId}`);
  }
  checkPermissions(req.user, job.createdBy);
  const updatedJob = await Job.findByIdAndUpdate(JobId, req.body, {
    new: true, //new:true => return the updated document not the original
    runValidators: true, //"runValidators: true => makes sure that the data being updated follows the rules set before in the schema before it is saved to the database"
  });
  res.status(StatusCodes.OK).json({ updatedJob });
};
//===================================================================================
//=======Delete a Job============================================================================
const deleteJob = async (req, res) => {
  const { id: JobId } = req.params;
  const job = await Job.findById(JobId);
  if (!job) {
    throw new NotFoundError(`No job found with id :${JobId}`);
  }
  checkPermissions(req.user, job.createdBy);
  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Job removed, Success!!" });
};
//===================================================================================

//==========Show Stats Using  aggregate pipeline======================================================================
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    // { $group: { _id: { status: '$status', position: '$position' }, count: { $sum: 1 } } }
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((element) => {
      const {
        _id: { year, month },
        count,
      } = element;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
