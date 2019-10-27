const fs = require('fs');
const express = require('express');
const { auth } = require('../shared/middleware');

const router = express.Router();
const { gcloud } = require('../shared/services');
const multer = require('multer');

const upload = multer({ dest: 'photos/' });

router.get('', auth.verifyToken, (req, res) => {
  res.send('this is PHOTOS ROOT');
});

router.post('/upload', upload.array('photos'), async (req, res) => {
  response = await gcloud.uploadFiles(req.files.map(file => file.path));
  req.files.forEach(file => {
    fs.stat(file.path, (err, stat) => {
      console.log(stat);
      fs.unlink(file.path, err => err && console.error(err));
    });
  });
  res.redirect('http://localhost:3000');
});

module.exports = router;
