const mongoose = require('mongoose');
const { auth } = require('../middleware');

const ImageSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  bucket: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150
  },
  tags: [
    {
      type: String
    }
  ],
  mediaLink: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  imageCreatedAt: Number,
  createdAt: Number,
  updatedAt: Number
});

ImageSchema.pre('save', next => {
  const now = Date.now();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

module.exports = {
  ImageSchema
};
