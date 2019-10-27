const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { keys, status } = require('../constants');

module.exports = {
  verifyToken(req, res, next) {
    const authorization = _.get(req, 'headers.authorization', '');
    const bearer = _.get(authorization.split(' '), '[1]');

    if (!bearer) {
      res.sendStatus(status.FORBIDDEN);
      next();
    } else {
      jwt.verify(bearer, keys.JWT, (err, authData) => {
        if (err) {
          res.sendStatus(status.INTERNAL_ERROR);
          next();
        } else {
          req.authData = authData;
          next();
        }
      });
    }
  },

  async preSave(next) {
    const now = Date.now();
    this.password = await promiseHash(this.password, 10);
    this.updatedAt = now;

    if (!this.createdAt) {
      this.createdAt = now;
    }

    next();
  }
};

function promiseHash(stringToHash, saltRounds = 10) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(stringToHash, saltRounds, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
