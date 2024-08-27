import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirement: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User',
  },
  application:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Application'
  }]
},{timestamps:true});

export const Job = mongoose.model('Job', jobSchema);
