const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { keys, status } = require('../shared/constants');
const { user } = require('../shared/models');

const router = express.Router();
const User = mongoose.model('User', user.UserSchema);

router.get('', (req, res) => res.sendStatus(status.NOT_FOUND));

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      res.status(status.NOT_FOUND);
      res.json({
        message: err || 'Username or password incorrect'
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        jwt.sign({ email, password }, keys.JWT, (err, token) => {
          if (err) {
            res.sendStatus(status.INTERNAL_ERROR);
          }
          res.json({ token });
        });
      } else {
        res.status(status.NOT_FOUND);
        res.json({
          message: err || 'Username or password incorrect'
        });
      }
    }
  });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });

  try {
    await user.save();

    jwt.sign({ name, email }, keys.JWT, (err, token) => {
      if (err) {
        res.sendStatus(status.INTERNAL_ERROR);
      }
      res.json({ token });
    });
  } catch (err) {
    res.status(status.INTERNAL_ERROR);
    res.json({
      message: err
    });
  }
});

module.exports = router;
