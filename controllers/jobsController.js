import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please provide user");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  
  if(status && status !== "all"){
    queryObject.status = status
  }
  if(status && jobType !== "all"){
    queryObject.jobType = jobType 
  }
  if(search){
    queryObject.position = { $regex: search, $options: 'i'}
  }

  //ad stuff based on condition

  let result = Job.find(queryObject);

  if(sort === "latest"){
    result = result.sort('-createdAt')
  }
  if(sort === "oldest"){
    result = result.sort('createdAt')
  }
  if(sort === "a-z"){
    result = result.sort('position')
  }
  if(sort === "z-a"){
    result = result.sort('-position')
  }

  //setup pagination

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1 ) * limit
  result = result.skip(skip).limit(limit);

  const jobs = await result
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs/limit);

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: totalJobs, numOfPages: numOfPages });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please provide All Values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  //check permisions
  checkPermissions(req.user, job.createdBy);

  const updateJob = await Job.findByIdAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updateJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: "Job deleted correctly" });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
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
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
