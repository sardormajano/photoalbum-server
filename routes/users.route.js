const express = require('express');
const jwt = require('jsonwebtoken');
const { keys, status } = require('../shared/constants');

const router = express.Router();
const { users: usersService } = require('../shared/services');

router.get('', (req, res) => res.send('this is USERS ROOT'));

router.post('/login', (req, res) => {
  const { name, email } = req.body;
  jwt.sign({ name, email }, keys.JWT, (err, token) => {
    if (err) {
      res.status(status.INTERNAL_ERROR);
    }
    res.json({ token });
  });
});

router.get('/:id', (req, res) => {
  const user = usersService.getUser(req.params.id);
  res.send(`The user's position is ${user.position}`);
});

router.post('/:id', (req, res) => {
  const userId = req.params.id;
  const body = req.body;
  usersService.addUser(userId, body);
  res.send('You are cool');
});

module.exports = router;
