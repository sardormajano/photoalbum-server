const config = require('config');
const mongoose = require('mongoose');
const { auth } = require('../middleware');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  createdAt: Number,
  updatedAt: Number,
  isAdmin: Boolean
});

UserSchema.pre('save', auth.preSave);

module.exports = {
  UserSchema
};
