const express = require('express');
const router = express.Router();
const { users: usersService } = require('../shared/services');

router.get('', (req, res) => res.send('this is USERS ROOT'));
router.get('/programmers', (req, res) =>
  res.send('this is USERS/PROGRAMMERS endpoint')
);
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
