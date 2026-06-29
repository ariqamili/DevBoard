const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  techStack: {
    type: [String],
    default: []
  },
  salary: {
    type: String,
    default: 'Not specified'
  },
  location: {
    type: String,
    default: 'Remote'
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);