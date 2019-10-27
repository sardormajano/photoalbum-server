const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { keys, status } = require('../constants');

module.exports = {
  verifyToken(req, res, next) {
    const authorization = _.get(req, 'headers.authorization', '');
    const bearer = _.get(authorization.split(' '), '[1]');

    if (!bearer) {
      res.status(status.FORBIDDEN);
    }

    jwt.verify(bearer, keys.JWT, (err, authData) => {
      if (err) {
        res.status(status.INTERNAL_ERROR);
      } else {
        req.authData = authData;
        next();
      }
    });
  }
};
